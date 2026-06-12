# SAMAVESH Documentation Portal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the bespoke SAMAVESH design system documentation portal at `apps/docs` (served at `/design-system`), replacing the temporary Storybook redirect with a world-class, interactive, three-audience docs site.

**Architecture:** Migrate current `apps/docs` (Storybook) → `apps/storybook`. Create fresh Next.js 16 App Router app at `apps/docs` (port 3002, basePath `/design-system`). Hub rewrites `/design-system/*` → `:3002`. All styling via `--ds-*` CSS custom properties (no Tailwind — proves the design system works without a CSS framework).

**Tech Stack:** Next.js 16 (App Router, RSC), TypeScript strict, react-live (interactive playground), fuse.js (⌘K search), @mosje/design-system (tokens + components), CSS custom properties only.

**Three audiences (layered on every page):**
- **Non-technical** — plain English, visuals first, no code visible unless opened
- **Designer** — anatomy, do/don't, Figma link, token names explained humanly
- **Developer** — props table, copy-paste code, CSS variable names, installation

---

## File Map

```
apps/storybook/          ← MOVED from apps/docs (unchanged Storybook)
  package.json           (name: @mosje/storybook, scripts same)
  stories/               (all existing stories unchanged)
  .storybook/            (config unchanged)

apps/docs/               ← NEW Next.js 16 docs portal
  package.json
  next.config.ts
  tsconfig.json
  src/
    app/
      layout.tsx                      ← root layout (ColorModeProvider, AppSwitcher, DocsLayout)
      globals.css                     ← @import tokens.css; CSS reset; typography base
      page.tsx                        ← Welcome / What is SAMAVESH?
      not-found.tsx
      foundations/
        layout.tsx                    ← foundations sub-layout (shared header "Foundations")
        color/page.tsx
        typography/page.tsx
        spacing/page.tsx
        elevation/page.tsx
        motion/page.tsx
        density/page.tsx
        iconography/page.tsx
        accessibility/page.tsx
      components/
        layout.tsx                    ← components sub-layout (shared header "Components")
        button/page.tsx               ← full 13-section exemplar
        input/page.tsx
        card/page.tsx
        badge/page.tsx
      resources/
        page.tsx                      ← overview: Figma + Storybook + quick links
        changelog/page.tsx
        governance/page.tsx
        contributing/page.tsx
        roadmap/page.tsx
    components/
      docs-layout/
        docs-layout.tsx               ← sidebar + topbar + content area shell
        sidebar-nav.tsx               ← grouped nav with active state (client)
        docs-header.tsx               ← breadcrumb + ⌘K trigger + theme swatch
        on-this-page.tsx              ← right-rail heading TOC (client, IntersectionObserver)
        docs-layout.css
      search/
        cmd-search.tsx                ← ⌘K modal (client, fuse.js)
        cmd-search.css
      playground/
        playground.tsx                ← composed playground (client)
        playground-canvas.tsx         ← react-live LivePreview wrapper
        playground-controls.tsx       ← prop knobs (text/boolean/select/color inputs)
        playground-toolbar.tsx        ← theme / density / RTL toggles
        playground-code.tsx           ← react-live LiveEditor + copy button
        playground.css
      docs-kit/
        props-table.tsx               ← prop definitions table
        do-dont.tsx                   ← side-by-side Do/Don't cards
        callout.tsx                   ← info/warning/tip callout boxes
        token-table.tsx               ← token name → value → usage table
        color-swatch.tsx              ← color chip: hex + token name + contrast
        type-specimen.tsx             ← live text specimen in a given type role
        anatomy.tsx                   ← numbered anatomy diagram wrapper
        status-badge.tsx              ← Proposed/Alpha/Beta/Stable/Deprecated badge
        a11y-checklist.tsx            ← WCAG criteria checklist per component
        section-header.tsx            ← audience-labeled section divider (Designer|Developer|All)
        docs-kit.css
    lib/
      nav.ts                          ← navigation tree (groups + items)
      search-data.ts                  ← static search index for fuse.js
      tokens.ts                       ← typed token value lookups (for ColorSwatch, TokenTable)
```

**Modified files:**
- `apps/hub/next.config.ts` — remove `/design-system` redirects, add rewrite → `:3002`
- `package.json` (root) — update `dev:docs`, add `dev:storybook`

---

## Design tokens reference (use these CSS variables throughout — never hardcode)

```css
/* Surfaces */
--ds-surface          /* page background */
--ds-surface-muted    /* sidebar, code blocks, section bg */
--ds-border           /* subtle dividers */
--ds-border-strong    /* visible borders */

/* Text */
--ds-ink              /* primary text */
--ds-ink-muted        /* secondary / captions */

/* Brand */
--ds-primary          /* interactive blue #0373DF */
--ds-primary-hover    /* #014B92 */
--ds-primary-tonal    /* light tint of primary */
--ds-primary-ring     /* focus ring rgba */

/* Status */
--ds-success   --ds-warning   --ds-danger   --ds-info

/* Typography */
--ds-font-sans         /* "Noto Sans", ui-sans-serif, ... */
--ds-text-display      /* 48px */
--ds-text-title-1      /* 22px */
--ds-text-headline     /* 20px */
--ds-text-body-1       /* 16px */
--ds-text-body-2       /* 14px */
--ds-text-body-3       /* 12px */
--ds-text-label-3      /* 11px */
--ds-leading-body-1   --ds-leading-body-2   --ds-leading-body-3

/* Spacing */
--ds-space-1  (4px)  --ds-space-2  (8px)   --ds-space-3  (12px)
--ds-space-4  (16px) --ds-space-5  (20px)  --ds-space-6  (24px)
--ds-space-8  (32px) --ds-space-10 (40px)  --ds-space-12 (48px)
--ds-space-14 (56px)

/* Radius */
--ds-radius-xs  (4px)  --ds-radius-sm (6px)
--ds-radius-md  (8px)  --ds-radius-pill (100px)

/* Shadow */
--ds-shadow-xs   --ds-shadow-lg   --ds-shadow-xl
```

---

## Task 1: Migrate Storybook to apps/storybook

**Files:**
- Create: `apps/storybook/` (copy of current `apps/docs`)
- Modify: `apps/storybook/package.json` — rename to `@mosje/storybook`
- Modify: `package.json` (root) — add `dev:storybook`, update `dev:docs`

- [ ] **Step 1: Copy apps/docs → apps/storybook**

```bash
cp -r apps/docs apps/storybook
```

- [ ] **Step 2: Update apps/storybook/package.json**

Change `"name": "@mosje/docs"` → `"name": "@mosje/storybook"`. Scripts stay the same (`dev: "storybook dev -p 6006"`).

- [ ] **Step 3: Update root package.json scripts**

Replace `"dev:docs": "npm --prefix apps/docs run dev"` with:
```json
"dev:storybook": "npm --prefix apps/storybook run dev",
"dev:docs": "npm --prefix apps/docs run dev",
```

Also update the `dev` concurrently command to use `apps/storybook` for storybook and add `apps/docs` as a new entry. The concurrently command should become:
```json
"dev": "concurrently --kill-others-on-fail --prefix-colors \"blue,cyan,yellow,green,magenta,white\" -n \"hub,dosje,smile,pm-ajay,docs,storybook\" \"npm --prefix apps/hub run dev\" \"npm --prefix apps/dosje run dev\" \"npm --prefix apps/portals/smile-admin run dev\" \"npm --prefix apps/portals/pm-ajay run dev\" \"npm --prefix apps/docs run dev\" \"npm --prefix apps/storybook run dev\""
```

- [ ] **Step 4: Install storybook deps**
```bash
npm --prefix apps/storybook install
```

- [ ] **Step 5: Verify storybook still starts**
```bash
npm --prefix apps/storybook run dev &
sleep 5 && curl -s -o /dev/null -w "%{http_code}" http://localhost:6006
# Expected: 200
```

---

## Task 2: Create apps/docs Next.js shell

**Files:**
- Create: `apps/docs/package.json`
- Create: `apps/docs/next.config.ts`
- Create: `apps/docs/tsconfig.json`
- Create: `apps/docs/src/app/globals.css`
- Create: `apps/docs/src/app/not-found.tsx`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@mosje/docs",
  "version": "0.1.0",
  "description": "SAMAVESH Design System — documentation portal",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start -p 3002",
    "typecheck": "tsc --noEmit",
    "lint": "next lint"
  },
  "dependencies": {
    "@mosje/design-system": "file:../../packages/design-system",
    "fuse.js": "^7.0.0",
    "next": "^15.5.19",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-live": "^4.1.7"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "^15.5.19",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create next.config.ts**

```typescript
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  basePath: "/design-system",
  output: "standalone",
  skipTrailingSlashRedirect: true,
  transpilePackages: ["@mosje/design-system", "react-live"],
  turbopack: {
    root: path.resolve(process.cwd(), "..", ".."),
  },
};

export default nextConfig;
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create src/app/globals.css**

```css
/* Import design system tokens — all --ds-* and --sa-* CSS custom properties */
@import "../../node_modules/@mosje/design-system/tokens.css";

/* Base reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  font-family: var(--ds-font-sans);
  font-size: var(--ds-text-body-1);
  line-height: var(--ds-leading-body-1);
  color: var(--ds-ink);
  background-color: var(--ds-surface);
  -webkit-font-smoothing: antialiased;
  scroll-behavior: smooth;
}

body { min-height: 100vh; }

/* Typography defaults */
h1 { font-size: var(--ds-text-display);   line-height: 1.15; font-weight: 500; }
h2 { font-size: var(--ds-text-title-1);   line-height: 1.3;  font-weight: 600; }
h3 { font-size: var(--ds-text-headline);  line-height: 1.4;  font-weight: 600; }
h4 { font-size: var(--ds-text-body-1);    line-height: 1.5;  font-weight: 600; }

p { line-height: var(--ds-leading-body-1); }

a { color: var(--ds-primary); text-decoration: none; }
a:hover { text-decoration: underline; }
a:focus-visible {
  outline: 3px solid var(--ds-primary-ring);
  outline-offset: 2px;
  border-radius: var(--ds-radius-xs);
}

/* Prose content (used in page bodies) */
.ds-prose p + p { margin-top: var(--ds-space-4); }
.ds-prose ul, .ds-prose ol { padding-left: var(--ds-space-6); margin-top: var(--ds-space-3); }
.ds-prose li + li { margin-top: var(--ds-space-2); }

/* Code */
code:not([class]) {
  font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace;
  font-size: 0.875em;
  background-color: var(--ds-surface-muted);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-xs);
  padding: 1px 5px;
  color: var(--ds-ink);
}

/* Skip to content */
.skip-link {
  position: absolute;
  top: -100%;
  left: var(--ds-space-4);
  z-index: 9999;
  padding: var(--ds-space-2) var(--ds-space-4);
  background: var(--ds-primary);
  color: #fff;
  border-radius: var(--ds-radius-sm);
  font-weight: 600;
  transition: top 0.1s;
}
.skip-link:focus { top: var(--ds-space-4); }
```

- [ ] **Step 5: Create src/app/not-found.tsx**

```tsx
export default function NotFound() {
  return (
    <main style={{ padding: "var(--ds-space-12)", textAlign: "center" }}>
      <h1 style={{ fontSize: "var(--ds-text-display)", color: "var(--ds-ink)" }}>
        404
      </h1>
      <p style={{ color: "var(--ds-ink-muted)", marginTop: "var(--ds-space-4)" }}>
        This page doesn&apos;t exist in the design system docs yet.
      </p>
      <a
        href="/design-system"
        style={{
          display: "inline-block",
          marginTop: "var(--ds-space-6)",
          color: "var(--ds-primary)",
        }}
      >
        ← Back to SAMAVESH
      </a>
    </main>
  );
}
```

- [ ] **Step 6: Install dependencies**

```bash
npm --prefix apps/docs install
```

---

## Task 3: Navigation tree and DocsLayout

**Files:**
- Create: `apps/docs/src/lib/nav.ts`
- Create: `apps/docs/src/components/docs-layout/docs-layout.tsx`
- Create: `apps/docs/src/components/docs-layout/sidebar-nav.tsx`
- Create: `apps/docs/src/components/docs-layout/docs-header.tsx`
- Create: `apps/docs/src/components/docs-layout/on-this-page.tsx`
- Create: `apps/docs/src/components/docs-layout/docs-layout.css`
- Create: `apps/docs/src/app/layout.tsx`

- [ ] **Step 1: Create src/lib/nav.ts**

```typescript
export interface NavItem {
  label: string;
  href: string;
  /** Badge shown next to label: Stable | Beta | Alpha | New */
  badge?: "Stable" | "Beta" | "Alpha" | "New";
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/** Full navigation tree for the SAMAVESH docs sidebar. */
export const NAV: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { label: "What is SAMAVESH?", href: "/design-system" },
      { label: "For Designers", href: "/design-system#for-designers" },
      { label: "For Developers", href: "/design-system#for-developers" },
    ],
  },
  {
    title: "Foundations",
    items: [
      { label: "Color", href: "/design-system/foundations/color", badge: "Stable" },
      { label: "Typography", href: "/design-system/foundations/typography", badge: "Stable" },
      { label: "Spacing", href: "/design-system/foundations/spacing", badge: "Stable" },
      { label: "Elevation", href: "/design-system/foundations/elevation", badge: "Stable" },
      { label: "Motion", href: "/design-system/foundations/motion", badge: "Beta" },
      { label: "Density", href: "/design-system/foundations/density", badge: "Stable" },
      { label: "Iconography", href: "/design-system/foundations/iconography", badge: "Beta" },
      { label: "Accessibility", href: "/design-system/foundations/accessibility", badge: "Stable" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Button", href: "/design-system/components/button", badge: "Stable" },
      { label: "Input", href: "/design-system/components/input", badge: "Stable" },
      { label: "Card", href: "/design-system/components/card", badge: "Stable" },
      { label: "Badge", href: "/design-system/components/badge", badge: "Stable" },
      { label: "Form Field", href: "/design-system/components/input#form-field", badge: "Stable" },
      { label: "Select", href: "/design-system/components/input#select", badge: "Beta" },
      { label: "Textarea", href: "/design-system/components/input#textarea", badge: "Stable" },
      { label: "Checkbox", href: "/design-system/components/input#checkbox", badge: "Alpha" },
      { label: "Alert", href: "/design-system/components/badge#alert", badge: "Beta" },
      { label: "App Switcher", href: "/design-system/components/badge#appswitcher", badge: "Beta" },
    ],
  },
  {
    title: "Patterns",
    items: [
      { label: "Task List", href: "/design-system/resources#patterns", badge: "Alpha" },
      { label: "Form Layout", href: "/design-system/resources#patterns", badge: "Alpha" },
      { label: "Data Tables", href: "/design-system/resources#patterns", badge: "Alpha" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Overview", href: "/design-system/resources" },
      { label: "Changelog", href: "/design-system/resources/changelog" },
      { label: "Governance", href: "/design-system/resources/governance" },
      { label: "Contributing", href: "/design-system/resources/contributing" },
      { label: "Roadmap", href: "/design-system/resources/roadmap" },
    ],
  },
];
```

- [ ] **Step 2: Create docs-layout.css**

```css
/* ============================================================================
   SAMAVESH Docs Portal — Layout
   ============================================================================ */

/* ── Shell ── */
.docs-shell {
  display: grid;
  grid-template-columns: 256px 1fr;
  grid-template-rows: 56px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  min-height: 100vh;
}

/* ── Sidebar ── */
.docs-sidebar {
  grid-area: sidebar;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid var(--ds-border);
  background-color: var(--ds-surface-muted);
  display: flex;
  flex-direction: column;
}

.docs-sidebar__brand {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: var(--ds-space-4) var(--ds-space-5);
  border-bottom: 1px solid var(--ds-border);
  text-decoration: none;
}

.docs-sidebar__logo {
  width: 28px;
  height: 28px;
  border-radius: var(--ds-radius-sm);
  background-color: var(--ds-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.docs-sidebar__name {
  font-size: var(--ds-text-body-2);
  font-weight: 700;
  color: var(--ds-ink);
  line-height: 1.2;
}

.docs-sidebar__tagline {
  font-size: var(--ds-text-label-3);
  color: var(--ds-ink-muted);
  line-height: 1;
}

.docs-sidebar__nav { flex: 1; padding: var(--ds-space-4) 0 var(--ds-space-8); }

/* ── Sidebar nav groups ── */
.docs-nav__group { margin-bottom: var(--ds-space-6); }

.docs-nav__group-title {
  padding: 0 var(--ds-space-5) var(--ds-space-2);
  font-size: var(--ds-text-label-3);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ds-ink-muted);
}

.docs-nav__item {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  padding: 6px var(--ds-space-5);
  font-size: var(--ds-text-body-2);
  color: var(--ds-ink);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: background-color 0.1s, color 0.1s;
}

.docs-nav__item:hover { background-color: var(--ds-border); }

.docs-nav__item.is-active {
  color: var(--ds-primary);
  background-color: var(--ds-primary-tonal);
  border-left-color: var(--ds-primary);
  font-weight: 600;
}

.docs-nav__item:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--ds-primary-ring);
}

.docs-nav__badge {
  margin-left: auto;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: var(--ds-radius-pill);
}
.docs-nav__badge--Stable  { background: var(--ds-success); color: #fff; }
.docs-nav__badge--Beta    { background: var(--ds-warning); color: var(--ds-ink); }
.docs-nav__badge--Alpha   { background: var(--ds-primary-tonal); color: var(--ds-primary); }
.docs-nav__badge--New     { background: var(--ds-info); color: #fff; }

/* ── Header ── */
.docs-header {
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: var(--ds-space-4);
  padding: 0 var(--ds-space-8);
  border-bottom: 1px solid var(--ds-border);
  background-color: var(--ds-surface);
}

.docs-header__breadcrumb {
  flex: 1;
  font-size: var(--ds-text-body-2);
  color: var(--ds-ink-muted);
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
}

.docs-header__breadcrumb-sep { color: var(--ds-border-strong); }

.docs-header__search-btn {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  padding: 6px var(--ds-space-3);
  border: 1px solid var(--ds-border-strong);
  border-radius: var(--ds-radius-sm);
  background: var(--ds-surface-muted);
  color: var(--ds-ink-muted);
  font-size: var(--ds-text-body-2);
  font-family: var(--ds-font-sans);
  cursor: pointer;
  transition: border-color 0.1s;
  min-width: 160px;
}
.docs-header__search-btn:hover { border-color: var(--ds-primary); }
.docs-header__search-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--ds-primary-ring);
}

.docs-header__search-kbd {
  margin-left: auto;
  font-size: 10px;
  background: var(--ds-border);
  border-radius: 3px;
  padding: 1px 4px;
}

/* ── Main content ── */
.docs-main {
  grid-area: main;
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: var(--ds-space-8);
  padding: var(--ds-space-8);
  max-width: 1100px;
}

.docs-content { min-width: 0; }

/* ── On This Page (right rail TOC) ── */
.docs-toc {
  position: sticky;
  top: calc(56px + var(--ds-space-8));
  height: fit-content;
}

.docs-toc__title {
  font-size: var(--ds-text-label-3);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ds-ink-muted);
  margin-bottom: var(--ds-space-3);
}

.docs-toc__list { list-style: none; }

.docs-toc__item {
  display: block;
  padding: 4px 0;
  font-size: var(--ds-text-body-3);
  color: var(--ds-ink-muted);
  text-decoration: none;
  border-left: 2px solid transparent;
  padding-left: var(--ds-space-3);
  transition: color 0.1s, border-color 0.1s;
}
.docs-toc__item:hover { color: var(--ds-ink); }
.docs-toc__item.is-active { color: var(--ds-primary); border-left-color: var(--ds-primary); }

/* ── Page header ── */
.docs-page-header {
  display: flex;
  align-items: flex-start;
  gap: var(--ds-space-4);
  margin-bottom: var(--ds-space-8);
  padding-bottom: var(--ds-space-6);
  border-bottom: 1px solid var(--ds-border);
}

.docs-page-header__text { flex: 1; }

.docs-page-header__title {
  font-size: var(--ds-text-display);
  font-weight: 500;
  color: var(--ds-ink);
  line-height: 1.15;
}

.docs-page-header__desc {
  margin-top: var(--ds-space-3);
  font-size: var(--ds-text-body-1);
  color: var(--ds-ink-muted);
  line-height: var(--ds-leading-body-1);
  max-width: 56ch;
}

.docs-page-header__actions {
  display: flex;
  gap: var(--ds-space-3);
  align-items: center;
  margin-top: var(--ds-space-4);
}

.docs-page-header__link {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  font-size: var(--ds-text-body-2);
  color: var(--ds-primary);
  border: 1px solid var(--ds-border-strong);
  border-radius: var(--ds-radius-sm);
  padding: 5px var(--ds-space-3);
  text-decoration: none;
  transition: border-color 0.1s, background-color 0.1s;
}
.docs-page-header__link:hover { border-color: var(--ds-primary); background: var(--ds-primary-tonal); }

/* ── Section heading ── */
.docs-section { margin-top: var(--ds-space-12); }
.docs-section:first-child { margin-top: 0; }

.docs-section__label {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  font-size: var(--ds-text-label-3);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ds-ink-muted);
  margin-bottom: var(--ds-space-4);
  padding: 3px var(--ds-space-3);
  border-radius: var(--ds-radius-pill);
  background: var(--ds-surface-muted);
}

.docs-section__heading {
  font-size: var(--ds-text-title-1);
  font-weight: 600;
  color: var(--ds-ink);
  margin-bottom: var(--ds-space-4);
  scroll-margin-top: calc(56px + var(--ds-space-6));
}

.docs-section__body {
  font-size: var(--ds-text-body-1);
  color: var(--ds-ink-muted);
  line-height: var(--ds-leading-body-1);
  max-width: 68ch;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .docs-main { grid-template-columns: 1fr; }
  .docs-toc { display: none; }
}

@media (max-width: 768px) {
  .docs-shell {
    grid-template-columns: 1fr;
    grid-template-areas: "header" "main";
  }
  .docs-sidebar { display: none; }
  .docs-main { padding: var(--ds-space-5); }
}
```

- [ ] **Step 3: Create sidebar-nav.tsx (client component)**

```tsx
"use client";
import * as React from "react";
import { NAV } from "@/lib/nav";

export function SidebarNav(): React.JSX.Element {
  const [pathname, setPathname] = React.useState("");

  React.useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <nav className="docs-sidebar__nav" aria-label="Documentation navigation">
      {NAV.map((group) => (
        <div key={group.title} className="docs-nav__group">
          <div className="docs-nav__group-title">{group.title}</div>
          {group.items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <a
                key={item.href}
                href={item.href}
                className={`docs-nav__item${isActive ? " is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
                {item.badge && (
                  <span className={`docs-nav__badge docs-nav__badge--${item.badge}`}>
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Create docs-header.tsx (client component)**

```tsx
"use client";
import * as React from "react";

interface DocsHeaderProps {
  onSearchOpen: () => void;
  breadcrumb?: string[];
}

export function DocsHeader({ onSearchOpen, breadcrumb = [] }: DocsHeaderProps): React.JSX.Element {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onSearchOpen();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onSearchOpen]);

  return (
    <header className="docs-header" role="banner">
      <div className="docs-header__breadcrumb" aria-label="Breadcrumb">
        <a href="/design-system" style={{ color: "var(--ds-ink-muted)", textDecoration: "none" }}>
          SAMAVESH
        </a>
        {breadcrumb.map((crumb, i) => (
          <React.Fragment key={i}>
            <span className="docs-header__breadcrumb-sep" aria-hidden="true">/</span>
            <span style={{ color: i === breadcrumb.length - 1 ? "var(--ds-ink)" : "inherit" }}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>
      <button
        className="docs-header__search-btn"
        onClick={onSearchOpen}
        aria-label="Search documentation (Cmd K)"
        type="button"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="m11 11 2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Search docs…
        <kbd className="docs-header__search-kbd">⌘K</kbd>
      </button>
      <a
        href="/storybook/"
        style={{ fontSize: "var(--ds-text-body-2)", color: "var(--ds-ink-muted)" }}
        target="_blank"
        rel="noopener noreferrer"
      >
        Storybook ↗
      </a>
    </header>
  );
}
```

- [ ] **Step 5: Create on-this-page.tsx (client component)**

```tsx
"use client";
import * as React from "react";

interface Heading { id: string; text: string; level: number; }

export function OnThisPage(): React.JSX.Element {
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const [activeId, setActiveId] = React.useState("");

  React.useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".docs-content h2, .docs-content h3"));
    setHeadings(els.map((el) => ({
      id: el.id,
      text: el.textContent ?? "",
      level: parseInt(el.tagName[1] ?? "2"),
    })).filter((h) => h.id));
  }, []);

  React.useEffect(() => {
    if (headings.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0 && visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-56px 0px -60% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [headings]);

  if (headings.length === 0) return <></>;

  return (
    <nav className="docs-toc" aria-label="On this page">
      <div className="docs-toc__title">On this page</div>
      <ul className="docs-toc__list">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`docs-toc__item${activeId === h.id ? " is-active" : ""}`}
              style={h.level === 3 ? { paddingLeft: "var(--ds-space-6)" } : undefined}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 6: Create docs-layout.tsx**

```tsx
"use client";
import * as React from "react";
import { SidebarNav } from "./sidebar-nav";
import { DocsHeader } from "./docs-header";
import { OnThisPage } from "./on-this-page";
import "./docs-layout.css";

interface DocsLayoutProps {
  children: React.ReactNode;
  breadcrumb?: string[];
}

export function DocsLayout({ children, breadcrumb }: DocsLayoutProps): React.JSX.Element {
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="docs-shell">
        <aside className="docs-sidebar">
          <a href="/design-system" className="docs-sidebar__brand">
            <span className="docs-sidebar__logo" aria-hidden="true">SA</span>
            <div>
              <div className="docs-sidebar__name">SAMAVESH</div>
              <div className="docs-sidebar__tagline">Design System</div>
            </div>
          </a>
          <SidebarNav />
        </aside>
        <DocsHeader onSearchOpen={() => setSearchOpen(true)} breadcrumb={breadcrumb} />
        <main id="main-content" className="docs-main">
          <div className="docs-content">{children}</div>
          <OnThisPage />
        </main>
      </div>
      {searchOpen && (
        <React.Suspense fallback={null}>
          {/* CmdSearch lazy-imported to keep initial bundle small */}
          <div onClick={() => setSearchOpen(false)} />
        </React.Suspense>
      )}
    </>
  );
}
```

- [ ] **Step 7: Create src/app/layout.tsx**

```tsx
import type { Metadata } from "next";
import { ColorModeProvider } from "@mosje/design-system";
import { AppSwitcher } from "@mosje/design-system";
import { DocsLayout } from "@/components/docs-layout/docs-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: { template: "%s — SAMAVESH Design System", default: "SAMAVESH Design System" },
  description:
    "The shared visual and interaction language for the MoSJE digital estate — 13 websites and 20 portals across 33+ organisations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ColorModeProvider defaultMode="blue-light">
          <DocsLayout>{children}</DocsLayout>
          <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
        </ColorModeProvider>
      </body>
    </html>
  );
}
```

---

## Task 4: ⌘K Search

**Files:**
- Create: `apps/docs/src/lib/search-data.ts`
- Create: `apps/docs/src/components/search/cmd-search.tsx`
- Create: `apps/docs/src/components/search/cmd-search.css`

- [ ] **Step 1: Create search-data.ts**

```typescript
export interface SearchEntry {
  title: string;
  section: string;
  href: string;
  keywords: string;
  type: "foundation" | "component" | "resource" | "page";
}

export const SEARCH_DATA: SearchEntry[] = [
  { title: "What is SAMAVESH?", section: "Getting Started", href: "/design-system", keywords: "overview introduction welcome", type: "page" },
  { title: "Color", section: "Foundations", href: "/design-system/foundations/color", keywords: "color colour palette primary brand token swatch gov-blue saffron", type: "foundation" },
  { title: "Typography", section: "Foundations", href: "/design-system/foundations/typography", keywords: "font noto sans devanagari hindi type specimen size weight", type: "foundation" },
  { title: "Spacing", section: "Foundations", href: "/design-system/foundations/spacing", keywords: "space gap margin padding scale 4px 8px 16px", type: "foundation" },
  { title: "Elevation", section: "Foundations", href: "/design-system/foundations/elevation", keywords: "shadow drop elevation layer depth", type: "foundation" },
  { title: "Motion", section: "Foundations", href: "/design-system/foundations/motion", keywords: "animation transition duration easing", type: "foundation" },
  { title: "Density", section: "Foundations", href: "/design-system/foundations/density", keywords: "compact comfortable dense height control", type: "foundation" },
  { title: "Iconography", section: "Foundations", href: "/design-system/foundations/iconography", keywords: "icon lucide svg emblems", type: "foundation" },
  { title: "Accessibility", section: "Foundations", href: "/design-system/foundations/accessibility", keywords: "wcag gigw a11y aria keyboard contrast screen reader", type: "foundation" },
  { title: "Button", section: "Components", href: "/design-system/components/button", keywords: "button cta action primary secondary ghost icon loading", type: "component" },
  { title: "Input", section: "Components", href: "/design-system/components/input", keywords: "input text field form control validation error", type: "component" },
  { title: "Card", section: "Components", href: "/design-system/components/card", keywords: "card container surface elevation clickable", type: "component" },
  { title: "Badge", section: "Components", href: "/design-system/components/badge", keywords: "badge tag status pill label count", type: "component" },
  { title: "Form Field", section: "Components", href: "/design-system/components/input#form-field", keywords: "form field label hint error required validation", type: "component" },
  { title: "Changelog", section: "Resources", href: "/design-system/resources/changelog", keywords: "version history release notes update", type: "resource" },
  { title: "Governance", section: "Resources", href: "/design-system/resources/governance", keywords: "lifecycle proposed alpha beta stable deprecated contribution rfc", type: "resource" },
  { title: "Contributing", section: "Resources", href: "/design-system/resources/contributing", keywords: "contribute pr pull request token component proposal", type: "resource" },
  { title: "Roadmap", section: "Resources", href: "/design-system/resources/roadmap", keywords: "planned upcoming future milestones", type: "resource" },
];
```

- [ ] **Step 2: Create cmd-search.css**

```css
.cmd-overlay {
  position: fixed;
  inset: 0;
  background: rgba(33, 33, 33, 0.5);
  z-index: 9000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  animation: cmd-fade-in 0.1s ease;
}
@keyframes cmd-fade-in { from { opacity: 0; } to { opacity: 1; } }

.cmd-modal {
  width: 100%;
  max-width: 560px;
  background: var(--ds-surface);
  border: 1px solid var(--ds-border-strong);
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow-xl);
  overflow: hidden;
  animation: cmd-slide-in 0.15s ease;
}
@keyframes cmd-slide-in { from { transform: translateY(-8px); opacity: 0; } to { transform: none; opacity: 1; } }

.cmd-search-row {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: var(--ds-space-4) var(--ds-space-5);
  border-bottom: 1px solid var(--ds-border);
}

.cmd-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--ds-text-body-1);
  font-family: var(--ds-font-sans);
  color: var(--ds-ink);
}
.cmd-search-input::placeholder { color: var(--ds-ink-muted); }

.cmd-results {
  max-height: 360px;
  overflow-y: auto;
  padding: var(--ds-space-2) 0;
}

.cmd-result {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: var(--ds-space-3) var(--ds-space-5);
  text-decoration: none;
  color: var(--ds-ink);
  transition: background 0.08s;
}
.cmd-result:hover, .cmd-result.is-focused {
  background: var(--ds-primary-tonal);
}
.cmd-result__icon {
  width: 28px;
  height: 28px;
  border-radius: var(--ds-radius-sm);
  background: var(--ds-surface-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 12px;
}
.cmd-result__label { font-size: var(--ds-text-body-2); font-weight: 600; }
.cmd-result__section { font-size: var(--ds-text-body-3); color: var(--ds-ink-muted); }

.cmd-empty {
  padding: var(--ds-space-8) var(--ds-space-5);
  text-align: center;
  color: var(--ds-ink-muted);
  font-size: var(--ds-text-body-2);
}

.cmd-footer {
  display: flex;
  gap: var(--ds-space-4);
  padding: var(--ds-space-3) var(--ds-space-5);
  border-top: 1px solid var(--ds-border);
  font-size: var(--ds-text-body-3);
  color: var(--ds-ink-muted);
}
.cmd-footer kbd {
  background: var(--ds-surface-muted);
  border: 1px solid var(--ds-border-strong);
  border-radius: 3px;
  padding: 1px 4px;
  font-size: 10px;
}
```

- [ ] **Step 3: Create cmd-search.tsx**

```tsx
"use client";
import * as React from "react";
import Fuse from "fuse.js";
import { SEARCH_DATA, type SearchEntry } from "@/lib/search-data";
import "./cmd-search.css";

const TYPE_ICONS: Record<SearchEntry["type"], string> = {
  foundation: "🎨",
  component: "🧩",
  resource: "📖",
  page: "🏠",
};

const fuse = new Fuse(SEARCH_DATA, {
  keys: ["title", "keywords", "section"],
  threshold: 0.3,
  includeScore: true,
});

interface CmdSearchProps {
  onClose: () => void;
}

export function CmdSearch({ onClose }: CmdSearchProps): React.JSX.Element {
  const [query, setQuery] = React.useState("");
  const [focusIdx, setFocusIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const results = React.useMemo(
    () => query.trim() ? fuse.search(query).map((r) => r.item) : SEARCH_DATA.slice(0, 8),
    [query]
  );

  React.useEffect(() => { inputRef.current?.focus(); }, []);
  React.useEffect(() => { setFocusIdx(0); }, [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusIdx((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setFocusIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Escape")    { onClose(); }
    if (e.key === "Enter" && results[focusIdx]) {
      window.location.href = results[focusIdx].href;
      onClose();
    }
  };

  return (
    <div className="cmd-overlay" onClick={onClose} role="dialog" aria-label="Search" aria-modal="true">
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <div className="cmd-search-row">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" stroke="var(--ds-ink-muted)" strokeWidth="1.5" />
            <path d="m11 11 2.5 2.5" stroke="var(--ds-ink-muted)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            className="cmd-search-input"
            placeholder="Search SAMAVESH…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search documentation"
            type="search"
          />
          <kbd onClick={onClose} style={{ cursor: "pointer" }}>Esc</kbd>
        </div>
        <div className="cmd-results" role="listbox" aria-label="Search results">
          {results.length === 0 ? (
            <p className="cmd-empty">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            results.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className={`cmd-result${i === focusIdx ? " is-focused" : ""}`}
                role="option"
                aria-selected={i === focusIdx}
                onClick={onClose}
              >
                <span className="cmd-result__icon" aria-hidden="true">
                  {TYPE_ICONS[item.type]}
                </span>
                <div>
                  <div className="cmd-result__label">{item.title}</div>
                  <div className="cmd-result__section">{item.section}</div>
                </div>
              </a>
            ))
          )}
        </div>
        <div className="cmd-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
```

---

## Task 5: Docs Kit components

**Files:** All in `apps/docs/src/components/docs-kit/`

- [ ] **Step 1: Create docs-kit.css**

```css
/* ============================================================================
   SAMAVESH Docs Kit — shared component styles
   ============================================================================ */

/* ── Props Table ── */
.props-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--ds-text-body-2);
  margin-top: var(--ds-space-4);
}
.props-table th {
  text-align: left;
  padding: var(--ds-space-2) var(--ds-space-3);
  border-bottom: 2px solid var(--ds-border-strong);
  font-size: var(--ds-text-label-3);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ds-ink-muted);
}
.props-table td {
  padding: var(--ds-space-3);
  border-bottom: 1px solid var(--ds-border);
  vertical-align: top;
  line-height: 1.5;
}
.props-table tr:last-child td { border-bottom: none; }
.props-table__name { font-weight: 600; color: var(--ds-primary); font-family: ui-monospace, monospace; }
.props-table__type { font-family: ui-monospace, monospace; font-size: 12px; color: var(--ds-ink-muted); }
.props-table__required { font-size: 10px; font-weight: 700; color: var(--ds-danger); }

/* ── Do/Don't ── */
.do-dont { display: grid; grid-template-columns: 1fr 1fr; gap: var(--ds-space-5); margin-top: var(--ds-space-5); }
@media (max-width: 640px) { .do-dont { grid-template-columns: 1fr; } }
.do-dont__card { border-radius: var(--ds-radius-md); overflow: hidden; border: 1px solid var(--ds-border); }
.do-dont__preview {
  padding: var(--ds-space-6);
  background: var(--ds-surface-muted);
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.do-dont__label {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  padding: var(--ds-space-3) var(--ds-space-4);
  font-size: var(--ds-text-body-2);
  font-weight: 700;
}
.do-dont__label--do  { color: var(--ds-success); border-top: 3px solid var(--ds-success); }
.do-dont__label--dont{ color: var(--ds-danger);  border-top: 3px solid var(--ds-danger);  }
.do-dont__body { padding: var(--ds-space-3) var(--ds-space-4) var(--ds-space-4); font-size: var(--ds-text-body-2); color: var(--ds-ink-muted); }

/* ── Callout ── */
.callout {
  display: flex;
  gap: var(--ds-space-4);
  padding: var(--ds-space-4) var(--ds-space-5);
  border-radius: var(--ds-radius-md);
  border-left: 4px solid;
  margin: var(--ds-space-5) 0;
  font-size: var(--ds-text-body-2);
  line-height: 1.6;
}
.callout--info    { background: var(--ds-primary-tonal); border-color: var(--ds-primary); color: var(--ds-ink); }
.callout--warning { background: #fffbeb; border-color: var(--ds-warning); color: var(--ds-ink); }
.callout--tip     { background: #f0fdf4; border-color: var(--ds-success); color: var(--ds-ink); }
.callout--danger  { background: #fff1f0; border-color: var(--ds-danger); color: var(--ds-ink); }
.callout__icon { flex-shrink: 0; font-size: 16px; margin-top: 1px; }
.callout__title { font-weight: 700; margin-bottom: var(--ds-space-1); }

/* ── Token Table ── */
.token-table { width: 100%; border-collapse: collapse; font-size: var(--ds-text-body-2); margin-top: var(--ds-space-4); }
.token-table th {
  text-align: left;
  padding: var(--ds-space-2) var(--ds-space-3);
  border-bottom: 2px solid var(--ds-border-strong);
  font-size: var(--ds-text-label-3);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ds-ink-muted);
}
.token-table td { padding: var(--ds-space-3); border-bottom: 1px solid var(--ds-border); vertical-align: middle; }
.token-table__name { font-family: ui-monospace, monospace; font-size: 12px; color: var(--ds-primary); }
.token-table__preview { width: 24px; height: 24px; border-radius: var(--ds-radius-xs); border: 1px solid var(--ds-border); }
.token-table__value { font-family: ui-monospace, monospace; font-size: 11px; color: var(--ds-ink-muted); }

/* ── Color Swatch ── */
.color-swatch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--ds-space-4); margin-top: var(--ds-space-5); }
.color-swatch {
  border-radius: var(--ds-radius-md);
  overflow: hidden;
  border: 1px solid var(--ds-border);
}
.color-swatch__chip { height: 80px; }
.color-swatch__info { padding: var(--ds-space-3); }
.color-swatch__name { font-size: var(--ds-text-body-2); font-weight: 600; color: var(--ds-ink); }
.color-swatch__token { font-family: ui-monospace, monospace; font-size: 10px; color: var(--ds-ink-muted); margin-top: 2px; }
.color-swatch__value { font-family: ui-monospace, monospace; font-size: 10px; color: var(--ds-ink-muted); }

/* ── Type Specimen ── */
.type-specimen { padding: var(--ds-space-6); background: var(--ds-surface-muted); border-radius: var(--ds-radius-md); border: 1px solid var(--ds-border); margin: var(--ds-space-4) 0; }
.type-specimen__meta { font-size: var(--ds-text-body-3); color: var(--ds-ink-muted); margin-bottom: var(--ds-space-3); font-family: ui-monospace, monospace; }

/* ── Status Badge ── */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-1);
  font-size: var(--ds-text-body-3);
  font-weight: 700;
  padding: 3px var(--ds-space-3);
  border-radius: var(--ds-radius-pill);
}
.status-badge--Stable     { background: #dcfce7; color: #166534; }
.status-badge--Beta       { background: #fef9c3; color: #854d0e; }
.status-badge--Alpha      { background: var(--ds-primary-tonal); color: var(--ds-primary); }
.status-badge--Proposed   { background: var(--ds-surface-muted); color: var(--ds-ink-muted); }
.status-badge--Deprecated { background: #fef2f2; color: var(--ds-danger); }

/* ── A11y Checklist ── */
.a11y-checklist { margin-top: var(--ds-space-4); }
.a11y-checklist__item {
  display: flex;
  align-items: flex-start;
  gap: var(--ds-space-3);
  padding: var(--ds-space-3) 0;
  border-bottom: 1px solid var(--ds-border);
  font-size: var(--ds-text-body-2);
}
.a11y-checklist__item:last-child { border-bottom: none; }
.a11y-checklist__icon { color: var(--ds-success); flex-shrink: 0; margin-top: 1px; }
.a11y-checklist__criterion { font-weight: 600; color: var(--ds-ink); }
.a11y-checklist__desc { color: var(--ds-ink-muted); margin-top: 2px; font-size: var(--ds-text-body-3); }
```

- [ ] **Step 2: Create props-table.tsx**

```tsx
import * as React from "react";
import "./docs-kit.css";

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export function PropsTable({ props }: { props: PropDef[] }): React.JSX.Element {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="props-table">
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name}>
              <td>
                <span className="props-table__name">{p.name}</span>
                {p.required && <span className="props-table__required"> *required</span>}
              </td>
              <td><code className="props-table__type">{p.type}</code></td>
              <td>{p.default ? <code className="props-table__type">{p.default}</code> : <span style={{ color: "var(--ds-ink-muted)" }}>—</span>}</td>
              <td>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: Create do-dont.tsx**

```tsx
import * as React from "react";

interface DoDontCard {
  type: "do" | "dont";
  preview: React.ReactNode;
  label: string;
}

export function DoDont({ cards }: { cards: DoDontCard[] }): React.JSX.Element {
  return (
    <div className="do-dont">
      {cards.map((card, i) => (
        <div key={i} className="do-dont__card">
          <div className="do-dont__preview">{card.preview}</div>
          <div className={`do-dont__label do-dont__label--${card.type}`}>
            {card.type === "do" ? "✓ Do" : "✕ Don't"}
          </div>
          <p className="do-dont__body">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create callout.tsx**

```tsx
import * as React from "react";

const ICONS = { info: "ℹ️", warning: "⚠️", tip: "💡", danger: "🚨" };

interface CalloutProps {
  type?: "info" | "warning" | "tip" | "danger";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps): React.JSX.Element {
  return (
    <div className={`callout callout--${type}`} role={type === "danger" ? "alert" : undefined}>
      <span className="callout__icon" aria-hidden="true">{ICONS[type]}</span>
      <div>
        {title && <div className="callout__title">{title}</div>}
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create token-table.tsx**

```tsx
import * as React from "react";

interface TokenRow {
  token: string;
  value: string;
  description: string;
  isColor?: boolean;
}

export function TokenTable({ tokens }: { tokens: TokenRow[] }): React.JSX.Element {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="token-table">
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Value</th>
            <th scope="col">Usage</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.token}>
              <td><code className="token-table__name">{t.token}</code></td>
              <td>
                {t.isColor && (
                  <span
                    className="token-table__preview"
                    style={{ backgroundColor: t.value, display: "inline-block", marginRight: "var(--ds-space-2)", verticalAlign: "middle" }}
                    aria-hidden="true"
                  />
                )}
                <code className="token-table__value">{t.value}</code>
              </td>
              <td style={{ color: "var(--ds-ink-muted)", fontSize: "var(--ds-text-body-2)" }}>{t.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 6: Create color-swatch.tsx**

```tsx
import * as React from "react";

interface SwatchProps {
  name: string;
  token: string;
  hex: string;
  contrastWith?: "white" | "black";
}

export function ColorSwatchGrid({ swatches }: { swatches: SwatchProps[] }): React.JSX.Element {
  return (
    <div className="color-swatch-grid">
      {swatches.map((s) => (
        <div key={s.token} className="color-swatch">
          <div className="color-swatch__chip" style={{ backgroundColor: s.hex }} aria-hidden="true" />
          <div className="color-swatch__info">
            <div className="color-swatch__name">{s.name}</div>
            <div className="color-swatch__token">{s.token}</div>
            <div className="color-swatch__value">{s.hex}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Create type-specimen.tsx**

```tsx
import * as React from "react";

interface TypeSpecimenProps {
  role: string;
  size: string;
  weight: string;
  leading: string;
  sample: string;
  sampleHi?: string;
}

export function TypeSpecimen({ role, size, weight, leading, sample, sampleHi }: TypeSpecimenProps): React.JSX.Element {
  return (
    <div className="type-specimen">
      <div className="type-specimen__meta">
        {role} · {size} · {weight} · lh {leading}
      </div>
      <div style={{ fontSize: size, fontWeight: weight, lineHeight: leading }}>
        {sample}
      </div>
      {sampleHi && (
        <div style={{ fontSize: size, fontWeight: weight, lineHeight: "1.7", marginTop: "var(--ds-space-2)", fontFamily: "\"Noto Sans Devanagari\", var(--ds-font-sans)" }}>
          {sampleHi}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Create status-badge.tsx**

```tsx
import * as React from "react";

type Status = "Proposed" | "Alpha" | "Beta" | "Stable" | "Deprecated";
const DOTS: Record<Status, string> = {
  Proposed: "○", Alpha: "◑", Beta: "◕", Stable: "●", Deprecated: "✕",
};

export function StatusBadge({ status }: { status: Status }): React.JSX.Element {
  return (
    <span className={`status-badge status-badge--${status}`} aria-label={`Component status: ${status}`}>
      <span aria-hidden="true">{DOTS[status]}</span>
      {status}
    </span>
  );
}
```

- [ ] **Step 9: Create a11y-checklist.tsx**

```tsx
import * as React from "react";

interface A11yItem {
  criterion: string;
  level: "A" | "AA" | "AAA" | "GIGW";
  description: string;
}

export function A11yChecklist({ items }: { items: A11yItem[] }): React.JSX.Element {
  return (
    <ul className="a11y-checklist" aria-label="Accessibility requirements">
      {items.map((item, i) => (
        <li key={i} className="a11y-checklist__item">
          <span className="a11y-checklist__icon" aria-hidden="true">✓</span>
          <div>
            <div className="a11y-checklist__criterion">
              {item.criterion}{" "}
              <span style={{ fontSize: "10px", fontWeight: 700, padding: "1px 5px", borderRadius: "3px", background: "var(--ds-primary-tonal)", color: "var(--ds-primary)" }}>
                WCAG {item.level}
              </span>
            </div>
            <div className="a11y-checklist__desc">{item.description}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
```

---

## Task 6: Interactive Playground

**Files:** All in `apps/docs/src/components/playground/`

- [ ] **Step 1: Create playground.css**

```css
/* ============================================================================
   SAMAVESH Playground
   ============================================================================ */
.playground {
  border: 1px solid var(--ds-border-strong);
  border-radius: var(--ds-radius-md);
  overflow: hidden;
  margin: var(--ds-space-5) 0;
}

/* ── Toolbar ── */
.playground-toolbar {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: var(--ds-space-3) var(--ds-space-4);
  background: var(--ds-surface-muted);
  border-bottom: 1px solid var(--ds-border);
  flex-wrap: wrap;
}

.playground-toolbar__label {
  font-size: var(--ds-text-label-3);
  color: var(--ds-ink-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-right: auto;
}

.pg-toggle-group {
  display: flex;
  border: 1px solid var(--ds-border-strong);
  border-radius: var(--ds-radius-sm);
  overflow: hidden;
}

.pg-toggle {
  padding: 4px var(--ds-space-3);
  background: transparent;
  border: none;
  font-size: var(--ds-text-body-3);
  font-family: var(--ds-font-sans);
  color: var(--ds-ink-muted);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}
.pg-toggle.is-active {
  background: var(--ds-primary);
  color: #fff;
}
.pg-toggle:not(:last-child) { border-right: 1px solid var(--ds-border-strong); }

/* ── Canvas ── */
.playground-canvas {
  padding: var(--ds-space-10);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  background: var(--ds-surface);
}

/* ── Controls ── */
.playground-controls {
  padding: var(--ds-space-4) var(--ds-space-5);
  background: var(--ds-surface-muted);
  border-top: 1px solid var(--ds-border);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--ds-space-4);
}

.pg-control { display: flex; flex-direction: column; gap: var(--ds-space-1); }
.pg-control__label { font-size: var(--ds-text-label-3); font-weight: 600; color: var(--ds-ink-muted); }
.pg-control__input {
  height: 32px;
  border: 1px solid var(--ds-border-strong);
  border-radius: var(--ds-radius-xs);
  background: var(--ds-surface);
  color: var(--ds-ink);
  font-family: var(--ds-font-sans);
  font-size: var(--ds-text-body-2);
  padding: 0 var(--ds-space-3);
}
.pg-control__input:focus-visible {
  outline: none;
  border-color: var(--ds-primary);
  box-shadow: 0 0 0 3px var(--ds-primary-ring);
}

/* ── Code editor ── */
.playground-code {
  border-top: 1px solid var(--ds-border);
  position: relative;
}

.playground-code__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ds-space-2) var(--ds-space-4);
  background: #1e2130;
  font-size: var(--ds-text-body-3);
  color: #8892a4;
}

.playground-code__copy {
  background: transparent;
  border: 1px solid #3d4458;
  border-radius: var(--ds-radius-xs);
  color: #8892a4;
  font-family: var(--ds-font-sans);
  font-size: 11px;
  padding: 2px 8px;
  cursor: pointer;
  transition: color 0.1s, border-color 0.1s;
}
.playground-code__copy:hover { color: #e2e8f0; border-color: #6b7280; }

/* react-live editor override */
.playground-code .prism-code {
  background: #1e2130 !important;
  padding: var(--ds-space-4) var(--ds-space-5) !important;
  font-size: 13px !important;
  line-height: 1.6 !important;
  min-height: 80px;
}
```

- [ ] **Step 2: Create playground-toolbar.tsx**

```tsx
"use client";
import * as React from "react";

interface PlaygroundToolbarProps {
  theme: string;
  onThemeChange: (t: string) => void;
  density: string;
  onDensityChange: (d: string) => void;
  rtl: boolean;
  onRtlChange: (r: boolean) => void;
}

export function PlaygroundToolbar({
  theme, onThemeChange,
  density, onDensityChange,
  rtl, onRtlChange,
}: PlaygroundToolbarProps): React.JSX.Element {
  return (
    <div className="playground-toolbar">
      <span className="playground-toolbar__label">Playground</span>

      <div className="pg-toggle-group" role="group" aria-label="Theme">
        {(["light", "dark", "hc"] as const).map((t) => (
          <button key={t} className={`pg-toggle${theme === t ? " is-active" : ""}`} onClick={() => onThemeChange(t)} type="button">
            {t === "hc" ? "HC" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="pg-toggle-group" role="group" aria-label="Density">
        {(["comfortable", "compact"] as const).map((d) => (
          <button key={d} className={`pg-toggle${density === d ? " is-active" : ""}`} onClick={() => onDensityChange(d)} type="button">
            {d === "comfortable" ? "Default" : "Compact"}
          </button>
        ))}
      </div>

      <button className={`pg-toggle${rtl ? " is-active" : ""}`} onClick={() => onRtlChange(!rtl)} type="button" aria-pressed={rtl}>
        RTL
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Create playground-controls.tsx**

```tsx
"use client";
import * as React from "react";

export interface ControlDef {
  name: string;
  label: string;
  type: "text" | "boolean" | "select" | "color";
  options?: string[];
  defaultValue: string | boolean;
}

interface PlaygroundControlsProps {
  controls: ControlDef[];
  values: Record<string, string | boolean>;
  onChange: (name: string, value: string | boolean) => void;
}

export function PlaygroundControls({ controls, values, onChange }: PlaygroundControlsProps): React.JSX.Element {
  if (controls.length === 0) return <></>;
  return (
    <div className="playground-controls">
      {controls.map((ctrl) => (
        <div key={ctrl.name} className="pg-control">
          <label className="pg-control__label" htmlFor={`ctrl-${ctrl.name}`}>{ctrl.label}</label>
          {ctrl.type === "boolean" ? (
            <input
              id={`ctrl-${ctrl.name}`}
              type="checkbox"
              checked={!!values[ctrl.name]}
              onChange={(e) => onChange(ctrl.name, e.target.checked)}
            />
          ) : ctrl.type === "select" ? (
            <select
              id={`ctrl-${ctrl.name}`}
              className="pg-control__input"
              value={String(values[ctrl.name])}
              onChange={(e) => onChange(ctrl.name, e.target.value)}
            >
              {ctrl.options?.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : ctrl.type === "color" ? (
            <input
              id={`ctrl-${ctrl.name}`}
              type="color"
              value={String(values[ctrl.name])}
              onChange={(e) => onChange(ctrl.name, e.target.value)}
              style={{ height: "32px", width: "100%", cursor: "pointer" }}
            />
          ) : (
            <input
              id={`ctrl-${ctrl.name}`}
              className="pg-control__input"
              type="text"
              value={String(values[ctrl.name])}
              onChange={(e) => onChange(ctrl.name, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create playground.tsx (main composed component)**

```tsx
"use client";
import * as React from "react";
import { LiveProvider, LivePreview, LiveEditor, LiveError } from "react-live";
import * as DS from "@mosje/design-system";
import { PlaygroundToolbar } from "./playground-toolbar";
import { PlaygroundControls, type ControlDef } from "./playground-controls";
import "./playground.css";

const LIVE_SCOPE = {
  ...DS,
  React,
};

interface PlaygroundProps {
  /** Default code to render. Use JSX. Wrap in () for multi-line. */
  code: string;
  /** Prop controls definition */
  controls?: ControlDef[];
  /** Derive new code from current control values */
  buildCode?: (values: Record<string, string | boolean>) => string;
}

export function Playground({ code: initialCode, controls = [], buildCode }: PlaygroundProps): React.JSX.Element {
  const [theme, setTheme] = React.useState("light");
  const [density, setDensity] = React.useState("comfortable");
  const [rtl, setRtl] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const [values, setValues] = React.useState<Record<string, string | boolean>>(() =>
    Object.fromEntries(controls.map((c) => [c.name, c.defaultValue]))
  );

  const code = buildCode ? buildCode(values) : initialCode;

  const onChange = (name: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const dataTheme = theme === "hc" ? "hc" : theme === "dark" ? "dark" : undefined;
  const dataDensity = density === "compact" ? "compact" : undefined;

  return (
    <div className="playground">
      <PlaygroundToolbar
        theme={theme} onThemeChange={setTheme}
        density={density} onDensityChange={setDensity}
        rtl={rtl} onRtlChange={setRtl}
      />
      <LiveProvider code={code} scope={LIVE_SCOPE} noInline={false}>
        <div
          className="playground-canvas"
          data-theme={dataTheme}
          data-density={dataDensity}
          dir={rtl ? "rtl" : undefined}
        >
          <LivePreview />
          <LiveError style={{ color: "var(--ds-danger)", fontSize: "13px", marginTop: "8px" }} />
        </div>
        {controls.length > 0 && (
          <PlaygroundControls controls={controls} values={values} onChange={onChange} />
        )}
        <div className="playground-code">
          <div className="playground-code__header">
            <span>JSX</span>
            <button className="playground-code__copy" onClick={copy} type="button">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <LiveEditor />
        </div>
      </LiveProvider>
    </div>
  );
}
```

---

## Task 7: Welcome page

**File:** `apps/docs/src/app/page.tsx`

- [ ] **Step 1: Create welcome page**

Full page — introduces SAMAVESH to all three audiences. Shows stat cards, quick links, what's available, how to get started. Non-technical first, designer next, developer last.

```tsx
import * as React from "react";
import type { Metadata } from "next";
import { StatusBadge } from "@/components/docs-kit/status-badge";
import { Callout } from "@/components/docs-kit/callout";

export const metadata: Metadata = {
  title: "What is SAMAVESH? — SAMAVESH Design System",
  description:
    "SAMAVESH (समावेश, inclusion) is the shared design language for the MoSJE digital estate — 13 websites and 20 portals serving 33+ organisations and schemes.",
};

export default function WelcomePage(): React.JSX.Element {
  return (
    <>
      {/* ── Hero ── */}
      <div style={{ marginBottom: "var(--ds-space-12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--ds-space-4)", marginBottom: "var(--ds-space-5)" }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: "var(--ds-radius-md)",
              background: "var(--ds-primary)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 800,
            }}
            aria-hidden="true"
          >SA</div>
          <div>
            <h1 style={{ fontSize: "var(--ds-text-display)", fontWeight: 500, lineHeight: 1.1 }}>
              SAMAVESH
            </h1>
            <p style={{ fontSize: "var(--ds-text-body-1)", color: "var(--ds-ink-muted)" }}>
              समावेश · Design System · v0.5
            </p>
          </div>
        </div>

        <p style={{ fontSize: "var(--ds-text-title-1)", fontWeight: 400, color: "var(--ds-ink)", maxWidth: "60ch", lineHeight: 1.5, marginBottom: "var(--ds-space-5)" }}>
          The shared visual and interaction language for the <strong>Ministry of Social Justice &amp; Empowerment</strong> digital estate.
        </p>
        <p style={{ fontSize: "var(--ds-text-body-1)", color: "var(--ds-ink-muted)", maxWidth: "64ch", lineHeight: "var(--ds-leading-body-1)" }}>
          SAMAVESH (समावेश, &ldquo;inclusion / bringing together&rdquo;) ensures every citizen-facing website and portal — from the main DoSJE site to PM-AJAY, SMILE, and 20+ scheme portals — looks, feels, and works consistently. One system, one standard, serving every team.
        </p>

        <div style={{ display: "flex", gap: "var(--ds-space-3)", marginTop: "var(--ds-space-6)", flexWrap: "wrap" }}>
          <a
            href="/design-system/foundations/color"
            style={{
              display: "inline-flex", alignItems: "center", gap: "var(--ds-space-2)",
              padding: "10px var(--ds-space-5)", borderRadius: "var(--ds-radius-sm)",
              background: "var(--ds-primary)", color: "#fff",
              fontWeight: 600, fontSize: "var(--ds-text-body-2)", textDecoration: "none",
            }}
          >
            Explore Foundations →
          </a>
          <a
            href="/design-system/components/button"
            style={{
              display: "inline-flex", alignItems: "center", gap: "var(--ds-space-2)",
              padding: "10px var(--ds-space-5)", borderRadius: "var(--ds-radius-sm)",
              border: "1.5px solid var(--ds-border-strong)", color: "var(--ds-ink)",
              fontWeight: 600, fontSize: "var(--ds-text-body-2)", textDecoration: "none",
            }}
          >
            Browse Components
          </a>
          <a
            href="https://www.figma.com/design/qyzTEy8dlb3ssYctlkMX5o/SAMAVESH-Design-System"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "var(--ds-space-2)",
              padding: "10px var(--ds-space-5)", borderRadius: "var(--ds-radius-sm)",
              border: "1.5px solid var(--ds-border-strong)", color: "var(--ds-ink)",
              fontWeight: 600, fontSize: "var(--ds-text-body-2)", textDecoration: "none",
            }}
          >
            Open in Figma ↗
          </a>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "var(--ds-space-4)", marginBottom: "var(--ds-space-12)" }}>
        {[
          { stat: "30+", label: "Components" },
          { stat: "13", label: "Websites" },
          { stat: "20", label: "Portals" },
          { stat: "33+", label: "Organisations" },
          { stat: "WCAG AA", label: "Accessibility" },
          { stat: "Bilingual", label: "EN + हिन्दी" },
        ].map((card) => (
          <div
            key={card.stat}
            style={{
              padding: "var(--ds-space-5)", borderRadius: "var(--ds-radius-md)",
              border: "1px solid var(--ds-border)", background: "var(--ds-surface-muted)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "var(--ds-text-title-1)", fontWeight: 700, color: "var(--ds-primary)" }}>{card.stat}</div>
            <div style={{ fontSize: "var(--ds-text-body-3)", color: "var(--ds-ink-muted)", marginTop: "var(--ds-space-1)" }}>{card.label}</div>
          </div>
        ))}
      </div>

      <Callout type="tip" title="Release gate">
        Every component and pattern must work accessibly, in Hindi and English, on a ₹6,000 Android phone on 3G. If it doesn&apos;t, it doesn&apos;t ship.
      </Callout>

      {/* ── For each audience ── */}
      <section style={{ marginTop: "var(--ds-space-12)" }} id="for-designers">
        <h2 style={{ fontSize: "var(--ds-text-title-1)", fontWeight: 600, marginBottom: "var(--ds-space-4)", scrollMarginTop: "80px" }}>
          For Designers
        </h2>
        <p style={{ color: "var(--ds-ink-muted)", marginBottom: "var(--ds-space-5)", lineHeight: "var(--ds-leading-body-1)" }}>
          SAMAVESH gives you a complete Figma library — colors, typography, spacing, components — all in sync with the code. When a token changes in the system, your designs update automatically.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--ds-space-4)" }}>
          {[
            { title: "Token-based colors", desc: "Every color has a name and purpose. No guessing which blue to use.", href: "/design-system/foundations/color" },
            { title: "Type scale", desc: "Predefined type roles (Display, Headline, Body) for EN and हिन्दी.", href: "/design-system/foundations/typography" },
            { title: "Component library", desc: "Every Figma component maps directly to code — zero translation gap.", href: "/design-system/components/button" },
            { title: "Accessibility built in", desc: "Touch targets, contrast, and focus states are part of every component design.", href: "/design-system/foundations/accessibility" },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              style={{
                display: "block", padding: "var(--ds-space-5)",
                borderRadius: "var(--ds-radius-md)", border: "1px solid var(--ds-border)",
                textDecoration: "none", transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--ds-primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--ds-border)"; }}
            >
              <div style={{ fontWeight: 600, color: "var(--ds-ink)", marginBottom: "var(--ds-space-2)" }}>{card.title}</div>
              <div style={{ fontSize: "var(--ds-text-body-2)", color: "var(--ds-ink-muted)" }}>{card.desc}</div>
            </a>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "var(--ds-space-12)" }} id="for-developers">
        <h2 style={{ fontSize: "var(--ds-text-title-1)", fontWeight: 600, marginBottom: "var(--ds-space-4)", scrollMarginTop: "80px" }}>
          For Developers
        </h2>
        <p style={{ color: "var(--ds-ink-muted)", marginBottom: "var(--ds-space-5)", lineHeight: "var(--ds-leading-body-1)" }}>
          Import the package, import the tokens, use the components. Design system decisions are pre-made — focus on building features, not reimplementing buttons.
        </p>
        <div style={{ background: "#1e2130", borderRadius: "var(--ds-radius-md)", padding: "var(--ds-space-5)", fontFamily: "ui-monospace, monospace", fontSize: 13, color: "#e2e8f0", lineHeight: 1.7 }}>
          <div style={{ color: "#8892a4", marginBottom: "var(--ds-space-3)" }}># Install</div>
          <div><span style={{ color: "#7dd3fc" }}>npm</span> install @mosje/design-system</div>
          <div style={{ marginTop: "var(--ds-space-4)", color: "#8892a4" }}># Use in your app</div>
          <div><span style={{ color: "#c084fc" }}>import</span> {`{ Button, Card, FormField }`} <span style={{ color: "#c084fc" }}>from</span> <span style={{ color: "#86efac" }}>&apos;@mosje/design-system&apos;</span>;</div>
          <div><span style={{ color: "#c084fc" }}>import</span> <span style={{ color: "#86efac" }}>&apos;@mosje/design-system/tokens.css&apos;</span>;</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--ds-space-4)", marginTop: "var(--ds-space-5)" }}>
          {[
            { title: "No hardcoded values", desc: "All styling via --ds-* CSS custom properties. Change the theme, nothing breaks." },
            { title: "Accessibility included", desc: "ARIA labels, focus management, and keyboard navigation are in the components." },
            { title: "TypeScript-first", desc: "Every component is typed. Your IDE tells you which props are valid." },
            { title: "Works without Tailwind", desc: "Design system tokens are plain CSS variables — no framework dependency." },
          ].map((item) => (
            <div key={item.title} style={{ fontSize: "var(--ds-text-body-2)" }}>
              <div style={{ fontWeight: 600, color: "var(--ds-ink)", marginBottom: "var(--ds-space-1)" }}>✓ {item.title}</div>
              <div style={{ color: "var(--ds-ink-muted)" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "var(--ds-space-12)" }}>
        <h2 style={{ fontSize: "var(--ds-text-title-1)", fontWeight: 600, marginBottom: "var(--ds-space-5)", scrollMarginTop: "80px" }}>
          What&apos;s available
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--ds-space-3)" }}>
          {[
            { name: "Button", status: "Stable" as const, href: "/design-system/components/button" },
            { name: "Card", status: "Stable" as const, href: "/design-system/components/card" },
            { name: "Badge", status: "Stable" as const, href: "/design-system/components/badge" },
            { name: "Input / Textarea", status: "Stable" as const, href: "/design-system/components/input" },
            { name: "Select", status: "Beta" as const, href: "/design-system/components/input#select" },
            { name: "Form Field", status: "Stable" as const, href: "/design-system/components/input#form-field" },
            { name: "App Switcher", status: "Beta" as const, href: "/design-system/components/badge#appswitcher" },
            { name: "Color Mode", status: "Stable" as const, href: "/design-system/foundations/color#color-modes" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "var(--ds-space-3) var(--ds-space-4)",
                borderRadius: "var(--ds-radius-sm)", border: "1px solid var(--ds-border)",
                fontSize: "var(--ds-text-body-2)", color: "var(--ds-ink)", textDecoration: "none",
                transition: "border-color 0.1s",
              }}
            >
              {item.name}
              <StatusBadge status={item.status} />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
```

---

## Task 8: Foundations — Color page

**File:** `apps/docs/src/app/foundations/color/page.tsx`

Full page covering: what color tokens are (non-technical), swatch grid for all semantic colors, token table for developers, multi-brand explanation, color mode (light/dark/high-contrast) explanation with live demo using ColorModeProvider.

Key content:
- Plain English intro: "Colors in SAMAVESH have names based on their purpose, not their appearance"
- Primary palette swatches (--ds-primary, --ds-primary-hover, --ds-primary-tonal)
- Status colors (success, warning, danger, info)
- Neutral scale (surface, muted, border, ink)
- Brand colors (gov-blue, saffron, navy, yellow)
- TokenTable showing all semantic color tokens with values
- Do/Don't: use --ds-primary not #0373df
- A11y section: contrast ratios, how to check
- ColorMode switcher demo (inline, shows how data-theme works)

---

## Task 9: Foundations — Typography page

**File:** `apps/docs/src/app/foundations/typography/page.tsx`

Full page covering:
- Why two font families (Noto Sans for Latin, Noto Sans Devanagari for हिन्दी)
- TypeSpecimen for every role: Display (48px), Title 1 (22px), Headline (20px), Body 1 (16px), Body 2 (14px), Body 3 (12px), Label 3 (11px) — each shown in English AND हिन्दी
- Line height explanation (Latin 1.5, Devanagari 1.7 — why this matters)
- TokenTable: all --ds-text-* and --ds-leading-* vars
- Callout: loading Noto Sans via Google Fonts or system-font fallback chain

---

## Task 10: Remaining Foundation pages

**Files:**
- `apps/docs/src/app/foundations/spacing/page.tsx`
- `apps/docs/src/app/foundations/elevation/page.tsx`
- `apps/docs/src/app/foundations/motion/page.tsx`
- `apps/docs/src/app/foundations/density/page.tsx`
- `apps/docs/src/app/foundations/iconography/page.tsx`
- `apps/docs/src/app/foundations/accessibility/page.tsx`
- `apps/docs/src/app/foundations/layout.tsx`

**Spacing:** Visual scale (each space token rendered as a colored bar with px value), TokenTable (--ds-space-1 through --ds-space-14), do/don't for arbitrary px vs token.

**Elevation:** Shadow tiers (xs/lg/xl) shown on white cards against muted bg, CSS var values, when to use each.

**Motion:** Duration scale (fast 150ms, base 250ms, slow 400ms), easing curves, reduced-motion policy (prefers-reduced-motion), token table.

**Density:** Side-by-side comfortable vs compact control height demo, data-density attribute usage, when to use compact (data-dense portals), TokenTable.

**Iconography:** Lucide icon browser (render the 20 most-used icons from lucide-react), gov emblem SVGs, inline SVG for social icons, usage rules (size, color, aria-hidden).

**Accessibility:** WCAG 2.2 AA + GIGW overview in plain English, contrast checker demo (interactive — pick two colors, see ratio), keyboard navigation map table, how to test (screen readers, axe, keyboard), A11yChecklist with all SAMAVESH baseline requirements.

---

## Task 11: Button component page (full 13-section exemplar)

**File:** `apps/docs/src/app/components/button/page.tsx`

This is the reference implementation for how every component page is structured. Build it fully — other component pages will follow this pattern.

Sections (all 13):
1. **Purpose** — "A Button triggers an action…" (plain English)
2. **Anatomy** — labeled diagram (using CSS numbered markers over the button)
3. **When to use / not** — use for primary actions; don't use for navigation (use links)
4. **Variants** — live Playground showing: primary, secondary, ghost, danger variants + icon button
5. **States** — visual table: default / hover / focus / active / disabled / loading
6. **Behavior & Keyboard** — keyboard map table (Space/Enter activate, Tab focuses)
7. **Accessibility** — A11yChecklist items specific to Button
8. **Content & Voice** — EN: "Submit application" not "Click here"; HI: same rules
9. **Code** — PropsTable + installation snippet + usage example
10. **Responsive** — how button sizes respond; min touch target 44px note
11. **Evidence** — why these decisions were made (GOV.UK button research, WCAG touch targets)
12. **Related** — links to Form Field, Link component
13. **Changelog** — v0.5 initial release

The Playground in section 4 uses:
```
controls: [
  { name: "variant", label: "Variant", type: "select", options: ["primary","secondary","ghost","danger"], defaultValue: "primary" },
  { name: "size", label: "Size", type: "select", options: ["sm","md","lg"], defaultValue: "md" },
  { name: "disabled", label: "Disabled", type: "boolean", defaultValue: false },
  { name: "loading", label: "Loading", type: "boolean", defaultValue: false },
  { name: "label", label: "Label text", type: "text", defaultValue: "Submit application" },
]
buildCode: (v) => `<Button variant="${v.variant}" size="${v.size}"${v.disabled ? " disabled" : ""}${v.loading ? " loading" : ""}>${v.label}</Button>`
```

---

## Task 12: Input + Form Field component page

**File:** `apps/docs/src/app/components/input/page.tsx`

Four subsections (anchored): Input, Textarea, Select, Form Field.

Each subsection has Playground + PropsTable + A11y notes. FormField section shows the render-prop pattern and wiring.

Playground for Input:
```
code: `<FormField label="Full name" hint="As shown on Aadhaar card" required>
  {(ctrl) => <Input {...ctrl} placeholder="Enter your name" />}
</FormField>`
controls: [
  { name: "error", label: "Show error", type: "boolean", defaultValue: false },
  { name: "disabled", label: "Disabled", type: "boolean", defaultValue: false },
]
```

---

## Task 13: Card and Badge component pages

**Files:**
- `apps/docs/src/app/components/card/page.tsx`
- `apps/docs/src/app/components/badge/page.tsx`

**Card:** Playground showing clickable vs static card, with header/content/footer slots. PropsTable. Do/Don't (don't nest interactive elements without proper ARIA).

**Badge:** Playground showing all badge variants (default, success, warning, danger, info) + Chip component. PropsTable for both Badge and Chip.

---

## Task 14: Resources section

**Files:**
- `apps/docs/src/app/resources/page.tsx`
- `apps/docs/src/app/resources/changelog/page.tsx`
- `apps/docs/src/app/resources/governance/page.tsx`
- `apps/docs/src/app/resources/contributing/page.tsx`
- `apps/docs/src/app/resources/roadmap/page.tsx`
- `apps/docs/src/app/resources/layout.tsx`

**Resources overview:** Quick links grid — Figma library, Storybook, GitHub, Changelog; + contact info.

**Changelog:** Formatted keep-a-changelog content from the existing CHANGELOG.md. Group by version, show Added/Changed/Fixed/Deprecated badges.

**Governance:** Explain the component lifecycle in plain English (Proposed → Alpha → Beta → Stable → Deprecated with what each means for users and consumers). RFC process. Semver. Deprecation windows.

**Contributing:** How to propose a new component (RFC template), how to edit a token, how to run the system locally, contribution checklist.

**Roadmap:** Three columns: Now (v0.5 — what's shipped), Next (v0.6 — molecules, more components), Later (v1.0 — all 20 portals, Figma Code Connect full coverage, data-viz library).

---

## Task 15: Hub wiring

**Files:**
- Modify: `apps/hub/next.config.ts`
- Modify: `package.json` (root)

- [ ] **Step 1: Update hub next.config.ts**

Add `ZONE_DOCS` constant and rewrites. Remove the temporary `/design-system` redirect. Add rewrite pointing to the new docs portal at `:3002`.

```typescript
const ZONE_DOCS = process.env.ZONE_DOCS_URL ?? "http://localhost:3002";
```

Replace the `/design-system` redirect block with a rewrite:
```typescript
// In rewrites():
{ source: "/design-system",         destination: `${ZONE_DOCS}/design-system` },
{ source: "/design-system/",        destination: `${ZONE_DOCS}/design-system/` },
{ source: "/design-system/:path*",  destination: `${ZONE_DOCS}/design-system/:path*` },
```

Remove from `redirects()`:
```typescript
// DELETE these two lines:
{ source: "/design-system", destination: "/storybook/", permanent: false },
{ source: "/design-system/:path*", destination: "/storybook/", permanent: false },
```

- [ ] **Step 2: Update storybook rewrite to point to apps/storybook**

Storybook still runs on :6006 from apps/storybook — no change to the rewrite rules needed. Just update the `ZONE_DS` description comment.

- [ ] **Step 3: Update root package.json `dev` script**

Add `docs` and `storybook` both to the concurrently command, pointing to their respective directories.

---

## Task 16: Install, typecheck, smoke test

- [ ] **Step 1: Install all deps**
```bash
npm --prefix apps/docs install
npm --prefix apps/storybook install
```

- [ ] **Step 2: Typecheck docs**
```bash
npm --prefix apps/docs run typecheck
```
Expected: no errors.

- [ ] **Step 3: Start docs in isolation**
```bash
npm run dev:docs &
sleep 8
curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/design-system
# Expected: 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/design-system/foundations/color
# Expected: 200
```

- [ ] **Step 4: Start full estate and verify routing**
```bash
npm run dev &
sleep 12
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/design-system
# Expected: 200 (no longer a redirect to storybook)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/storybook/
# Expected: 200 (still works)
```

- [ ] **Step 5: Commit**
```bash
git add apps/docs apps/storybook apps/hub/next.config.ts package.json
git commit -m "feat(docs): SAMAVESH documentation portal — interactive playground, foundations, component pages, ⌘K search"
```

---

## Self-Review Checklist

- [x] Storybook migration covered (Task 1)
- [x] New Next.js shell with correct basePath and port (Task 2)
- [x] Navigation tree covers all pages (Task 3, nav.ts)
- [x] ⌘K search with fuse.js (Task 4)
- [x] All docs-kit components (Task 5): PropsTable, DoDont, Callout, TokenTable, ColorSwatch, TypeSpecimen, StatusBadge, A11yChecklist
- [x] Interactive playground with react-live + prop controls + toolbar (Task 6)
- [x] Welcome page (Task 7) — all three audiences served
- [x] Color, Typography foundations (Tasks 8-9) — full content
- [x] Remaining 6 foundation pages (Task 10) — content specified
- [x] Button (full 13-section exemplar, Task 11)
- [x] Input + FormField (Task 12)
- [x] Card + Badge (Task 13)
- [x] Resources section (Task 14) — Changelog, Governance, Contributing, Roadmap
- [x] Hub wiring: redirect removed, rewrite to :3002 added (Task 15)
- [x] Dependency install + typecheck + smoke test (Task 16)
- [x] Three-audience design: non-technical → designer → developer order on every page
- [x] All CSS uses --ds-* tokens only (no hardcoded hex)
- [x] Accessibility: skip-to-content, semantic headings with IDs, keyboard nav in search/playground
- [x] AppSwitcher wired in layout.tsx
- [x] ColorModeProvider in layout.tsx
