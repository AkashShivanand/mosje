# Single-Origin Estate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the MoSJE website, design system, and portals behind a single `localhost:3000` URL with a root landing gate, using a new `apps/hub` app as the root zone and Next.js `basePath`-based mounting for every child app.

**Architecture:** A new `apps/hub` (Next 16) owns the root and holds env-driven `rewrites()` that forward path prefixes to each child app's upstream URL. Each child app sets `basePath` to its mount path; Next.js auto-prefixes all `next/link`/`next/image`/`next/navigation` calls. Cross-zone navigation uses raw `<a>` tags. Local dev ports: hub=3000, dosje=3001, Storybook=6006, portals unchanged (4123–4125).

**Tech Stack:** Next.js 16.2.1 · React 19 · Tailwind v4 · `@mosje/design-system` · `concurrently` (root orchestration) · env-driven zone URLs

---

## File map

### New files
| File | Purpose |
|------|---------|
| `apps/hub/package.json` | Hub app manifest, scripts, deps |
| `apps/hub/tsconfig.json` | TypeScript config (mirrors dosje) |
| `apps/hub/next.config.ts` | Next config: env-driven rewrites to all zones |
| `apps/hub/postcss.config.mjs` | Tailwind v4 PostCSS |
| `apps/hub/eslint.config.mjs` | ESLint (mirrors dosje) |
| `apps/hub/.env.example` | Documents all zone URL env vars |
| `apps/hub/src/app/globals.css` | Tailwind v4 + design-system tokens import |
| `apps/hub/src/app/layout.tsx` | Root layout: Noto Sans, ColorModeProvider |
| `apps/hub/src/app/page.tsx` | Landing gate — 4 destination cards |
| `apps/hub/src/app/portals/page.tsx` | Portal selector — built + planned grid |
| `apps/hub/src/app/reports/page.tsx` | Reports — "Coming soon" stub |
| `apps/hub/src/data/portals.ts` | Portal registry data (seeded from architecture) |

### Modified files
| File | Change |
|------|--------|
| `package.json` | Add `concurrently` dep + root `dev` / `dev:*` scripts |
| `.claude/launch.json` | Add hub:3000, move dosje to 3001, add docs:6006 |
| `packages/design-system/components/button.tsx` | Export `buttonClasses()` helper for next/link usage |
| `apps/dosje/package.json` | Change dev/start port to 3001 |
| `apps/dosje/next.config.ts` | Add `basePath: "/website"` |
| `apps/dosje/src/components/PortalBanner.tsx` | `<a>` → `<Link>` (next/link) |
| `apps/dosje/src/components/ActivityCorner.tsx` | `<Button href>` → `<Link className={buttonClasses()}>` |
| `apps/dosje/src/components/LatestUpdates.tsx` | `<Button href>` → `<Link className={buttonClasses()}>` |
| `apps/dosje/src/components/SamaveshBanner.tsx` | `<Button href>` → `<Link className={buttonClasses()}>` |
| `apps/dosje/src/components/AboutUs.tsx` | `<Button href>` → `<Link className={buttonClasses()}>` |
| `apps/dosje/src/components/RecentDocuments.tsx` | `<Button href>` → `<Link className={buttonClasses()}>` |
| `apps/dosje/src/components/Header.tsx` | `<Button href="/admin">` → `<Link className={buttonClasses()}>` |
| `apps/dosje/src/app/privacy-policy/page.tsx` | `<a href="/contact-us">` → `<Link>` |
| `apps/dosje/src/app/accessibility/page.tsx` | `<a href="/contact-us">` → `<Link>` |
| `apps/portals/pm-ajay/next.config.ts` | Add `basePath: "/portals/pm-ajay"` |
| `apps/portals/smile-admin/next.config.ts` | Add `basePath: "/portals/smile-admin"` |
| `apps/portals/eutthan-admin/next.config.ts` | Add `basePath: "/portals/eutthan-admin"` |
| `MOSJE-ARCHITECTURE.md` | Update port table, add single-origin section |
| `CLAUDE.md` | Update dev command, ports, and active-context notes |

---

## Task 1: Root dev orchestration

**Files:**
- Modify: `package.json`
- Modify: `.claude/launch.json`

### Install concurrently and add root dev scripts

- [ ] **Step 1: Install concurrently at repo root**

```bash
npm install --save-dev concurrently@^9.1.2
```

Expected: `package.json` devDependencies gains `"concurrently": "^9.1.2"`.

- [ ] **Step 2: Add dev scripts to root `package.json`**

Open `package.json`. Replace the entire `"scripts"` block (add it if absent) so the file reads:

```json
{
  "name": "mosje",
  "version": "0.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "dev": "concurrently --kill-others-on-fail --prefix-colors \"blue,cyan,yellow,green,magenta,white\" -n \"hub,dosje,smile,pm-ajay,eutthan,docs\" \"npm --prefix apps/hub run dev\" \"npm --prefix apps/dosje run dev\" \"npm --prefix apps/portals/smile-admin run dev\" \"npm --prefix apps/portals/pm-ajay run dev\" \"npm --prefix apps/portals/eutthan-admin run dev\" \"npm --prefix apps/docs run dev\"",
    "dev:hub": "npm --prefix apps/hub run dev",
    "dev:website": "npm --prefix apps/dosje run dev",
    "dev:smile": "npm --prefix apps/portals/smile-admin run dev",
    "dev:pm-ajay": "npm --prefix apps/portals/pm-ajay run dev",
    "dev:eutthan": "npm --prefix apps/portals/eutthan-admin run dev",
    "dev:docs": "npm --prefix apps/docs run dev"
  },
  "devDependencies": {
    "concurrently": "^9.1.2",
    "stylelint": "^16.26.1"
  }
}
```

- [ ] **Step 3: Update `.claude/launch.json`**

Replace the entire file contents:

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "hub",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["--prefix", "apps/hub", "run", "dev"],
      "port": 3000
    },
    {
      "name": "dosje",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["--prefix", "apps/dosje", "run", "dev"],
      "port": 3001
    },
    {
      "name": "docs",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["--prefix", "apps/docs", "run", "dev"],
      "port": 6006
    },
    {
      "name": "smile-admin",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["--prefix", "apps/portals/smile-admin", "run", "dev"],
      "port": 4123
    },
    {
      "name": "pm-ajay",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["--prefix", "apps/portals/pm-ajay", "run", "dev"],
      "port": 4124
    },
    {
      "name": "eutthan-admin",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["--prefix", "apps/portals/eutthan-admin", "run", "dev"],
      "port": 4125
    }
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .claude/launch.json
git commit -m "chore: root dev orchestration with concurrently; update launch.json ports"
```

---

## Task 2: Scaffold `apps/hub` — core files

**Files:**
- Create: `apps/hub/package.json`
- Create: `apps/hub/tsconfig.json`
- Create: `apps/hub/next.config.ts`
- Create: `apps/hub/postcss.config.mjs`
- Create: `apps/hub/eslint.config.mjs`
- Create: `apps/hub/.env.example`

- [ ] **Step 1: Create `apps/hub/package.json`**

```json
{
  "name": "@mosje/hub",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@mosje/design-system": "file:../../packages/design-system",
    "clsx": "^2.1.1",
    "lucide-react": "^1.6.0",
    "next": "16.2.1",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^24",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create `apps/hub/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "preserveSymlinks": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `apps/hub/next.config.ts`**

The hub owns the root; no `basePath`. Rewrites delegate each path prefix to its upstream zone via env vars; local defaults ensure zero-config dev.

```typescript
import type { NextConfig } from "next";
import path from "node:path";

const ZONE_WEBSITE       = process.env.ZONE_WEBSITE_URL       ?? "http://localhost:3001";
const ZONE_DS            = process.env.ZONE_DS_URL            ?? "http://localhost:6006";
const ZONE_PM_AJAY       = process.env.ZONE_PM_AJAY_URL       ?? "http://localhost:4124";
const ZONE_SMILE_ADMIN   = process.env.ZONE_SMILE_ADMIN_URL   ?? "http://localhost:4123";
const ZONE_EUTTHAN_ADMIN = process.env.ZONE_EUTTHAN_ADMIN_URL ?? "http://localhost:4125";

const nextConfig: NextConfig = {
  transpilePackages: ["@mosje/design-system"],
  turbopack: {
    // Monorepo root is two levels up from apps/hub
    root: path.resolve(process.cwd(), "..", ".."),
  },
  async rewrites() {
    return [
      // dosje website zone
      { source: "/website",        destination: `${ZONE_WEBSITE}/website` },
      { source: "/website/:path*", destination: `${ZONE_WEBSITE}/website/:path*` },
      // portals
      { source: "/portals/pm-ajay",              destination: `${ZONE_PM_AJAY}/portals/pm-ajay` },
      { source: "/portals/pm-ajay/:path*",       destination: `${ZONE_PM_AJAY}/portals/pm-ajay/:path*` },
      { source: "/portals/smile-admin",          destination: `${ZONE_SMILE_ADMIN}/portals/smile-admin` },
      { source: "/portals/smile-admin/:path*",   destination: `${ZONE_SMILE_ADMIN}/portals/smile-admin/:path*` },
      { source: "/portals/eutthan-admin",        destination: `${ZONE_EUTTHAN_ADMIN}/portals/eutthan-admin` },
      { source: "/portals/eutthan-admin/:path*", destination: `${ZONE_EUTTHAN_ADMIN}/portals/eutthan-admin/:path*` },
      // design system — Storybook dev server (note: root-relative Storybook assets
      // won't resolve through this proxy in dev; open localhost:6006 directly for
      // full HMR. This rewrite works correctly with a static Storybook export in prod.)
      { source: "/design-system",        destination: `${ZONE_DS}/` },
      { source: "/design-system/:path*", destination: `${ZONE_DS}/:path*` },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 4: Create `apps/hub/postcss.config.mjs`**

```javascript
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

- [ ] **Step 5: Create `apps/hub/eslint.config.mjs`**

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
```

- [ ] **Step 6: Create `apps/hub/.env.example`**

```
# Zone upstream URLs — leave blank in dev (next.config.ts defaults to localhost:PORT).
# In production, set each to the deployed URL of that zone.

ZONE_WEBSITE_URL=
ZONE_DS_URL=
ZONE_PM_AJAY_URL=
ZONE_SMILE_ADMIN_URL=
ZONE_EUTTHAN_ADMIN_URL=
```

- [ ] **Step 7: Install hub dependencies**

```bash
npm install --prefix apps/hub
```

Expected: `apps/hub/node_modules/` populated; `apps/hub/package-lock.json` created.

- [ ] **Step 8: Commit**

```bash
git add apps/hub/package.json apps/hub/package-lock.json apps/hub/tsconfig.json \
        apps/hub/next.config.ts apps/hub/postcss.config.mjs apps/hub/eslint.config.mjs \
        apps/hub/.env.example
git commit -m "feat(hub): scaffold apps/hub — Next 16 root zone with env-driven rewrites"
```

---

## Task 3: Hub app source — layout, pages, and portal data

**Files:**
- Create: `apps/hub/src/app/globals.css`
- Create: `apps/hub/src/app/layout.tsx`
- Create: `apps/hub/src/data/portals.ts`
- Create: `apps/hub/src/app/page.tsx`
- Create: `apps/hub/src/app/portals/page.tsx`
- Create: `apps/hub/src/app/reports/page.tsx`

- [ ] **Step 1: Create `apps/hub/src/app/globals.css`**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@mosje/design-system/tokens.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: var(--font-noto-sans), "Noto Sans", ui-sans-serif, system-ui, sans-serif;

  /* Map DS semantic tokens to Tailwind utility names */
  --color-ink:            var(--ds-ink);
  --color-ink-muted:      var(--ds-ink-muted);
  --color-gov-blue:       var(--ds-primary);
  --color-gov-blue-tonal: var(--ds-primary-tonal);
  --color-surface:        var(--ds-surface);
  --color-surface-muted:  var(--ds-surface-muted);
  --color-border:         var(--ds-border);
}
```

- [ ] **Step 2: Create `apps/hub/src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { ColorModeProvider } from "@mosje/design-system";
import { colorModeInitScript } from "@mosje/design-system/color-mode";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MoSJE Digital Estate",
  description:
    "Ministry of Social Justice and Empowerment — unified digital estate gateway.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${notoSans.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeInitScript() }} />
      </head>
      <body className="min-h-full font-sans bg-surface-muted text-ink">
        <ColorModeProvider>{children}</ColorModeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create `apps/hub/src/data/portals.ts`**

This is the single source of truth for the portal selector. Add entries as portals are built.

```typescript
export interface PortalEntry {
  slug: string;
  name: string;
  org: string;
  description: string;
  status: "built" | "planned";
  path: string;
}

export const portals: PortalEntry[] = [
  {
    slug: "pm-ajay",
    name: "PM-AJAY",
    org: "Ministry of Social Justice & Empowerment",
    description:
      "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana — MIS dashboard with financial, scheme, and governance views.",
    status: "built",
    path: "/portals/pm-ajay",
  },
  {
    slug: "smile-admin",
    name: "SMILE Beggary Rehabilitation",
    org: "Ministry of Social Justice & Empowerment",
    description:
      "Single Access Mechanism for Identification, Mobilisation, Shelter & Rehabilitation admin portal.",
    status: "built",
    path: "/portals/smile-admin",
  },
  {
    slug: "eutthan-admin",
    name: "E-Utthan Admin",
    org: "Ministry of Social Justice & Empowerment",
    description:
      "E-Utthan administrative portal for scheme management and oversight.",
    status: "built",
    path: "/portals/eutthan-admin",
  },
  {
    slug: "nsfdc",
    name: "NSFDC",
    org: "National Scheduled Castes Finance & Development Corporation",
    description:
      "Finance and development corporation portal for scheduled castes.",
    status: "planned",
    path: "/portals/nsfdc",
  },
  {
    slug: "nskfdc",
    name: "NSKFDC",
    org: "National Safai Karamcharis Finance & Development Corporation",
    description: "Finance and development portal for safai karamcharis.",
    status: "planned",
    path: "/portals/nskfdc",
  },
  {
    slug: "nbcfdc",
    name: "NBCFDC",
    org: "National Backward Classes Finance & Development Corporation",
    description: "Finance and development portal for backward classes.",
    status: "planned",
    path: "/portals/nbcfdc",
  },
  {
    slug: "nos",
    name: "National Overseas Scholarship",
    org: "Ministry of Social Justice & Empowerment",
    description: "National Overseas Scholarship scheme portal.",
    status: "planned",
    path: "/portals/nos",
  },
  {
    slug: "pm-yasasvi",
    name: "PM YASASVI",
    org: "Ministry of Social Justice & Empowerment",
    description: "PM Young Achievers Scholarship Award Scheme for OBC/EBC/DNT students.",
    status: "planned",
    path: "/portals/pm-yasasvi",
  },
];
```

- [ ] **Step 4: Create `apps/hub/src/app/page.tsx`**

Cross-zone links MUST be raw `<a>` tags (not `next/link`) so the browser performs a full-page navigation across zone boundaries.

```tsx
import { Globe, BookOpen, LayoutDashboard, FileBarChart, ArrowRight } from "lucide-react";

const destinations = [
  {
    title: "Website",
    description: "Unified informational site for DoSJE and its associated organisations.",
    icon: Globe,
    href: "/website",
    cta: "Visit website",
    available: true,
  },
  {
    title: "Design System",
    description: "SAMAVESH component library, design tokens, and Storybook documentation.",
    icon: BookOpen,
    href: "/design-system",
    cta: "Open Storybook",
    available: true,
  },
  {
    title: "Portals",
    description: "Authenticated workflow portals for schemes, scholarships, and organisations.",
    icon: LayoutDashboard,
    href: "/portals",
    cta: "Select a portal",
    available: true,
  },
  {
    title: "Reports",
    description: "QC and audit reports for the MoSJE digital estate.",
    icon: FileBarChart,
    href: "/reports",
    cta: "Coming soon",
    available: false,
  },
] as const;

export default function GatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Gov utility bar */}
      <header className="border-b border-border bg-surface py-4">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-6">
          <span className="text-lg font-semibold text-gov-blue">MoSJE</span>
          <span aria-hidden="true" className="text-border">|</span>
          <span className="text-sm text-ink-muted">Digital Estate</span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-[1280px] px-6 pb-4 pt-16">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gov-blue">
          Government of India
        </p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-ink">
          Ministry of Social Justice &amp; Empowerment
        </h1>
        <p className="max-w-xl text-ink-muted">
          Select a destination to access the website, design system, workflow
          portals, or audit reports.
        </p>
      </section>

      {/* Destination cards */}
      <main id="main-content" className="mx-auto w-full max-w-[1280px] flex-1 px-6 pb-16 pt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map(({ title, description, icon: Icon, href, cta, available }) =>
            available ? (
              <a
                key={title}
                href={href}
                className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition hover:border-gov-blue hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-gov-blue"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gov-blue-tonal text-gov-blue">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mb-1.5 text-lg font-semibold text-ink">{title}</h2>
                <p className="mb-6 flex-1 text-sm text-ink-muted">{description}</p>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-gov-blue transition-all group-hover:gap-2.5">
                  {cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            ) : (
              <div
                key={title}
                aria-label={`${title} — ${cta}`}
                className="flex cursor-not-allowed flex-col rounded-xl border border-border bg-surface-muted p-6 opacity-60"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-border text-ink-muted">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mb-1.5 text-lg font-semibold text-ink">{title}</h2>
                <p className="mb-6 flex-1 text-sm text-ink-muted">{description}</p>
                <span className="text-sm text-ink-muted">{cta}</span>
              </div>
            )
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-surface px-6 py-4 text-center text-xs text-ink-muted">
        Ministry of Social Justice and Empowerment — Government of India
      </footer>
    </div>
  );
}
```

- [ ] **Step 5: Create `apps/hub/src/app/portals/page.tsx`**

The `/portals` route is served by the hub itself (not forwarded), so `next/link` is correct here for the breadcrumb. Portal card links to other zones MUST be raw `<a>` tags.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { portals } from "@/data/portals";

export const metadata: Metadata = {
  title: "Portals — MoSJE Digital Estate",
  description:
    "Select a workflow portal to access schemes, scholarships, and organisational services.",
};

export default function PortalsPage() {
  const built = portals.filter((p) => p.status === "built");
  const planned = portals.filter((p) => p.status === "planned");

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-ink-muted">
            <li>
              <Link href="/" className="hover:text-gov-blue hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              Portals
            </li>
          </ol>
        </nav>

        <h1 className="mb-2 text-3xl font-bold text-ink">Workflow Portals</h1>
        <p className="mb-10 text-ink-muted">
          Authenticated portals for managing schemes, scholarships, and
          organisations under MoSJE.
        </p>

        {/* Built portals */}
        <section aria-labelledby="built-heading" className="mb-12">
          <h2 id="built-heading" className="mb-5 text-xl font-semibold text-ink">
            Available now
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {built.map((portal) => (
              <a
                key={portal.slug}
                href={portal.path}
                className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition hover:border-gov-blue hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-gov-blue"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-ink">{portal.name}</h3>
                  <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    Live
                  </span>
                </div>
                <p className="mb-2 text-xs text-ink-muted">{portal.org}</p>
                <p className="mb-5 flex-1 text-sm text-ink-muted">{portal.description}</p>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-gov-blue transition-all group-hover:gap-2.5">
                  Open portal
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Planned portals */}
        {planned.length > 0 && (
          <section aria-labelledby="planned-heading">
            <h2 id="planned-heading" className="mb-5 text-xl font-semibold text-ink">
              In development
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {planned.map((portal) => (
                <div
                  key={portal.slug}
                  className="flex flex-col rounded-xl border border-border bg-surface p-6 opacity-60"
                  aria-label={`${portal.name} — Planned`}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-ink">{portal.name}</h3>
                    <span className="shrink-0 rounded-full bg-border px-2 py-0.5 text-xs font-semibold text-ink-muted">
                      Planned
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-ink-muted">{portal.org}</p>
                  <p className="flex-1 text-sm text-ink-muted">{portal.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create `apps/hub/src/app/reports/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { FileBarChart } from "lucide-react";

export const metadata: Metadata = {
  title: "QC & Audit Reports — MoSJE Digital Estate",
  description:
    "Quality assurance and audit reports for the MoSJE digital estate.",
};

export default function ReportsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gov-blue-tonal text-gov-blue">
        <FileBarChart className="h-8 w-8" aria-hidden="true" />
      </div>
      <h1 className="mb-3 text-3xl font-bold text-ink">QC &amp; Audit Reports</h1>
      <p className="mb-8 max-w-md text-ink-muted">
        This portal will surface quality assurance audits, design QC reports,
        and accessibility compliance findings for all MoSJE digital properties.
      </p>
      <span className="rounded-full bg-border px-4 py-2 text-sm font-semibold text-ink-muted">
        Coming soon
      </span>
      <Link
        href="/"
        className="mt-8 text-sm text-gov-blue hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-gov-blue"
      >
        ← Back to home
      </Link>
    </main>
  );
}
```

- [ ] **Step 7: Verify hub starts**

```bash
npm --prefix apps/hub run dev
```

Open `http://localhost:3000` in a browser. Expected: landing gate renders with 4 cards (Website, Design System, Portals, Reports). Reports card is visually dimmed. Navigate to `localhost:3000/portals` — portal selector shows 3 "Available now" cards and 5 "In development" cards. Navigate to `localhost:3000/reports` — stub page with "Coming soon" badge.

- [ ] **Step 8: Verify TypeScript**

```bash
npm --prefix apps/hub run typecheck
```

Expected: exits 0 with no type errors.

- [ ] **Step 9: Commit**

```bash
git add apps/hub/src/
git commit -m "feat(hub): landing gate, portal selector, and reports stub"
```

---

## Task 4: Mount dosje at `/website`

**Files:**
- Modify: `apps/dosje/package.json`
- Modify: `apps/dosje/next.config.ts`
- Modify: `packages/design-system/components/button.tsx`
- Modify: `apps/dosje/src/components/PortalBanner.tsx`
- Modify: `apps/dosje/src/components/ActivityCorner.tsx`
- Modify: `apps/dosje/src/components/LatestUpdates.tsx`
- Modify: `apps/dosje/src/components/SamaveshBanner.tsx`
- Modify: `apps/dosje/src/components/AboutUs.tsx`
- Modify: `apps/dosje/src/components/RecentDocuments.tsx`
- Modify: `apps/dosje/src/components/Header.tsx`
- Modify: `apps/dosje/src/app/privacy-policy/page.tsx`
- Modify: `apps/dosje/src/app/accessibility/page.tsx`

**Why the sweep is needed:** `basePath: "/website"` causes Next.js to auto-prefix `next/link` hrefs and `next/image` srcs with `/website`, but raw `<a href="/path">` elements and the DS `Button`'s `href` prop (which renders a raw `<a>`) are NOT auto-prefixed. All internal dosje navigation must go through `next/link`.

**The DS fix:** Export a `buttonClasses()` helper from the design-system `Button` so dosje can style a `<Link>` as a button without rendering an unmanaged `<a>`.

- [ ] **Step 1: Update dosje dev port in `apps/dosje/package.json`**

In the `scripts` block, change:
```json
"dev": "next dev",
"start": "next start",
```
to:
```json
"dev": "next dev -p 3001",
"start": "next start -p 3001",
```

- [ ] **Step 2: Add `basePath` to `apps/dosje/next.config.ts`**

Open `apps/dosje/next.config.ts`. In the `nextConfig` object, add `basePath: "/website"` as the first property:

```typescript
const nextConfig: NextConfig = {
  basePath: "/website",
  output: "standalone",
  trailingSlash: true,
  turbopack: {
    root: path.resolve(process.cwd(), "..", ".."),
  },
  transpilePackages: ["@mosje/design-system"],
};
```

- [ ] **Step 3: Export `buttonClasses` from `packages/design-system/components/button.tsx`**

Open `packages/design-system/components/button.tsx`. Add the following export AFTER the `Button` component (after line 89):

```typescript
/**
 * Returns the CSS class string for a button variant without rendering the button.
 * Use when you need a `next/link` or other element styled as a DS button:
 *   <Link href="/path" className={buttonClasses("primary", "filled", "md")}>Label</Link>
 */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  appearance: ButtonAppearance = "filled",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn("ds-btn", `ds-btn--${variant}`, `ds-btn--${appearance}`, `ds-btn--${size}`, className);
}
```

- [ ] **Step 4: Fix `apps/dosje/src/components/PortalBanner.tsx`**

Read the file, then change the raw `<a href="/samavesh-citizen-portals">` to `<Link>`. Add `import Link from "next/link"` at the top:

```tsx
import Image from "next/image";
import Link from "next/link";

export function PortalBanner() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-8">
        <Link
          href="/samavesh-citizen-portals"
          className="block overflow-hidden rounded-xl"
          aria-label="Explore the SAMAVESH citizen portal"
        >
          {/* Image elements unchanged */}
          <Image
            src="/images/portal-banner-images.png"
            alt="SAMAVESH citizen portal banner"
            width={1280}
            height={320}
            className="hidden h-auto w-full rounded-xl object-cover md:block"
          />
          <Image
            src="/images/Samavesh-Banner-Mobile.png"
            alt="SAMAVESH citizen portal banner"
            width={640}
            height={800}
            className="h-auto w-full rounded-xl object-cover md:hidden"
          />
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Fix `apps/dosje/src/components/ActivityCorner.tsx`**

Read the file. The three `<Button href="/events">` calls render raw `<a>` tags via the DS. Replace each with a `<Link>` styled via `buttonClasses`. At the top of the file, change the import block:

```tsx
// Before
import { Button, Card } from "@mosje/design-system";

// After
import { Card, buttonClasses } from "@mosje/design-system";
import Link from "next/link";
```

Then for each occurrence, replace (read the file to find the exact props on each Button, e.g. `variant`, `appearance`, `size`, `className` — preserve them all):
```tsx
// Before (example — actual props may vary, read the file)
<Button href="/events" variant="primary" appearance="outlined" size="sm">
  View All Events
</Button>

// After
<Link href="/events" className={buttonClasses("primary", "outlined", "sm")}>
  View All Events
</Link>
```

Repeat for all three `<Button href="/events">` occurrences in the file.

- [ ] **Step 6: Fix `apps/dosje/src/components/LatestUpdates.tsx`**

Read the file. Change:
```tsx
// Before
import { Button, Badge } from "@mosje/design-system";
// ...
<Button href="/notices" variant="primary" appearance="outlined" size="sm" className="ml-1 whitespace-nowrap">
  Notices
</Button>

// After — add Link import, replace Button href with Link + buttonClasses
import { Badge, buttonClasses } from "@mosje/design-system";
import Link from "next/link";
// ...
<Link href="/notices" className={buttonClasses("primary", "outlined", "sm", "ml-1 whitespace-nowrap")}>
  Notices
</Link>
```

- [ ] **Step 7: Fix `apps/dosje/src/components/SamaveshBanner.tsx`**

Read the file. The `<Button href="/samavesh-citizen-portals">` renders an unmanaged anchor. Read the exact variant/appearance/size/className props, then:

```tsx
// Before
import { Button } from "@mosje/design-system";
// ...
<Button href="/samavesh-citizen-portals" /* props */>...</Button>

// After
import { buttonClasses } from "@mosje/design-system";
import Link from "next/link";
// ...
<Link href="/samavesh-citizen-portals" className={buttonClasses(/* same props */)}>...</Link>
```

- [ ] **Step 8: Fix `apps/dosje/src/components/AboutUs.tsx`**

Read the file. Apply the same pattern: replace `<Button href="/about-us/">` with `<Link href="/about-us/" className={buttonClasses(...)}>`. Preserve exact variant/appearance/size. Note the trailing slash — preserve it.

- [ ] **Step 9: Fix `apps/dosje/src/components/RecentDocuments.tsx`**

Read the file. There are two occurrences of `<Button href="/annual-reports">`. Replace both with `<Link href="/annual-reports" className={buttonClasses(...)}>`; preserve exact props on each. There is also a `href={persona.href}` — read the file to check what element this is on; if it's a DS `<Button href>`, apply the same fix.

- [ ] **Step 10: Fix `apps/dosje/src/components/Header.tsx`**

Read the file. The `<Button href="/admin">` renders an unmanaged anchor for the Admin link. Replace:

```tsx
// Before
<Button href="/admin" variant="primary" size="sm" className="whitespace-nowrap">
  Admin
</Button>

// After
<Link href="/admin" className={buttonClasses("primary", "filled", "sm", "whitespace-nowrap")}>
  Admin
</Link>
```

Add `import Link from "next/link"` and swap `Button` for `buttonClasses` in the import from `@mosje/design-system` if `Button` is no longer used in this file.

- [ ] **Step 11: Fix `apps/dosje/src/app/privacy-policy/page.tsx`**

Read the file. Find `<a href="/contact-us">`. Change to `<Link href="/contact-us">` and add `import Link from "next/link"` if not already imported.

- [ ] **Step 12: Fix `apps/dosje/src/app/accessibility/page.tsx`**

Read the file. Find `<a href="/contact-us">`. Change to `<Link href="/contact-us">`. Add `import Link from "next/link"` if not already present.

- [ ] **Step 13: Run dosje typecheck**

```bash
npm --prefix apps/dosje run typecheck
```

Expected: exits 0. Fix any import errors (e.g., `buttonClasses` not in DS exports) — if the DS `package.json` exports don't expose `button.tsx`, check `packages/design-system/package.json` exports and ensure the `"."` export resolves to a barrel that re-exports `buttonClasses`.

- [ ] **Step 14: Start dosje standalone (verify basePath works)**

```bash
npm --prefix apps/dosje run dev
```

Open `http://localhost:3001/website` — the homepage should render correctly. Open `http://localhost:3001/website/events` — events page should render. Open `http://localhost:3000/website` (with hub running) — should proxy through correctly. Internal links on the dosje site (e.g. clicking the SAMAVESH banner) should navigate to `/website/samavesh-citizen-portals`, not `/samavesh-citizen-portals`.

- [ ] **Step 15: Commit**

```bash
git add packages/design-system/components/button.tsx \
        apps/dosje/package.json apps/dosje/next.config.ts \
        apps/dosje/src/
git commit -m "feat(dosje): mount at /website — basePath, port 3001, absolute-href sweep"
```

---

## Task 5: Mount pm-ajay at `/portals/pm-ajay`

**Files:**
- Modify: `apps/portals/pm-ajay/next.config.ts`

`pm-ajay`'s one absolute path concern is `<Link href="/">` in `navbar.tsx` — this links to the portal root and will correctly resolve to `/portals/pm-ajay` with basePath set.

- [ ] **Step 1: Add `basePath` to `apps/portals/pm-ajay/next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/portals/pm-ajay",
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 2: Verify pm-ajay**

```bash
npm --prefix apps/portals/pm-ajay run dev
```

Open `http://localhost:4124/portals/pm-ajay` — the MIS dashboard should render. Click a nav item — the URL should stay under `/portals/pm-ajay/`. With hub running, open `http://localhost:3000/portals/pm-ajay` — should proxy correctly.

- [ ] **Step 3: Commit**

```bash
git add apps/portals/pm-ajay/next.config.ts
git commit -m "feat(pm-ajay): mount at /portals/pm-ajay — add basePath"
```

---

## Task 6: Mount smile-admin at `/portals/smile-admin`

**Files:**
- Modify: `apps/portals/smile-admin/next.config.ts`

smile-admin's internal `<Link href="/...">` navigation (sidebar, breadcrumbs) all go through `next/link` and will be auto-prefixed. The `router.replace("/login")` auth guard in the app layout uses `next/navigation` which also respects basePath. No file changes other than next.config.

- [ ] **Step 1: Add `basePath` to `apps/portals/smile-admin/next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/portals/smile-admin",
};

export default nextConfig;
```

- [ ] **Step 2: Verify smile-admin**

```bash
npm --prefix apps/portals/smile-admin run dev
```

Open `http://localhost:4123/portals/smile-admin` — the login page should appear. Enter credentials and navigate in — sidebar links should stay under `/portals/smile-admin/`. With hub running, open `http://localhost:3000/portals/smile-admin` — should proxy correctly and auth redirect (if triggered) should land on `/portals/smile-admin/login`.

- [ ] **Step 3: Commit**

```bash
git add apps/portals/smile-admin/next.config.ts
git commit -m "feat(smile-admin): mount at /portals/smile-admin — add basePath"
```

---

## Task 7: Mount eutthan-admin at `/portals/eutthan-admin`

**Files:**
- Modify: `apps/portals/eutthan-admin/next.config.ts`

eutthan-admin uses a catch-all `[[...slug]]` route and `<Link href="/dashboard">` — both work with basePath automatically (catch-all captures everything under the basePath prefix; `next/link` auto-prefixes).

- [ ] **Step 1: Add `basePath` to `apps/portals/eutthan-admin/next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/portals/eutthan-admin",
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 2: Verify eutthan-admin**

```bash
npm --prefix apps/portals/eutthan-admin run dev
```

Open `http://localhost:4125/portals/eutthan-admin` — the portal should render. Click any internal link — URL should remain under `/portals/eutthan-admin/`. With hub running, open `http://localhost:3000/portals/eutthan-admin` — should proxy correctly.

- [ ] **Step 3: Commit**

```bash
git add apps/portals/eutthan-admin/next.config.ts
git commit -m "feat(eutthan-admin): mount at /portals/eutthan-admin — add basePath"
```

---

## Task 8: Update project documentation

**Files:**
- Modify: `MOSJE-ARCHITECTURE.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update the port table in `MOSJE-ARCHITECTURE.md`**

In the `## Cross-cutting` section, find the line about per-portal ports. Replace it and add a new single-origin section before it:

```markdown
## Single-origin layout (active)

All apps are accessible from **`localhost:3000`** (hub) in development, and from a single
production origin in production. The hub at `apps/hub` holds the routing rewrites.

| App | Dev port | Mount path |
|-----|----------|-----------|
| hub | **3000** | `/` (root) |
| dosje (website) | 3001 | `/website` |
| docs (Storybook) | 6006 | `/design-system` |
| portals/smile-admin | 4123 | `/portals/smile-admin` |
| portals/pm-ajay | 4124 | `/portals/pm-ajay` |
| portals/eutthan-admin | 4125 | `/portals/eutthan-admin` |

New portals: add a `basePath: "/portals/<slug>"` to their `next.config.ts`, add a rewrite
rule to `apps/hub/next.config.ts`, and add an entry to `apps/hub/src/data/portals.ts`.
```

- [ ] **Step 2: Update `CLAUDE.md` dev command and active context**

In the `## Commands` section, update the dev command entry:
```
- `npm run dev` — boot ALL apps behind `localhost:3000` (hub gate + website + portals + Storybook). Each app can also be run standalone: `npm run dev:website`, `npm run dev:smile`, etc.
- `apps/hub`: root entry point at **:3000** (`npm run dev:hub`)
- `apps/dosje`: standalone at **:3001** (`npm run dev:website`), mounted at `/website` via hub
```

In `## Active context`, add after the design-system note:
```
- **Single-origin layout is live.** `apps/hub` is the root zone. All apps mount via `basePath`. Run `npm run dev` from repo root to bring everything up at `localhost:3000`.
```

- [ ] **Step 3: Commit docs**

```bash
git add MOSJE-ARCHITECTURE.md CLAUDE.md
git commit -m "docs: update architecture and CLAUDE.md for single-origin estate layout"
```

---

## Task 9: Full integration smoke test

No file changes — verification only.

- [ ] **Step 1: Start all apps**

```bash
npm run dev
```

Wait for all 6 processes to report ready (watch the prefixed console output: hub, dosje, smile, pm-ajay, eutthan, docs).

- [ ] **Step 2: Test the gate**

Open `http://localhost:3000`. Expected: landing gate with 4 destination cards.

- [ ] **Step 3: Test the website zone**

Click the "Website" card → should navigate to `http://localhost:3000/website` and render the DoSJE homepage. Click an internal link (e.g. the SAMAVESH banner) → URL should remain under `/website/`. No 404s on any navigation.

- [ ] **Step 4: Test the portal selector**

Navigate to `http://localhost:3000/portals`. Expected: 3 live portals, 5 planned portals.

- [ ] **Step 5: Test each portal**

Click "Open portal" for pm-ajay → `http://localhost:3000/portals/pm-ajay` renders MIS dashboard. Back → click smile-admin → `http://localhost:3000/portals/smile-admin` renders login. Back → click eutthan-admin → `http://localhost:3000/portals/eutthan-admin` renders the portal.

- [ ] **Step 6: Test reports stub**

Navigate to `http://localhost:3000/reports`. Expected: stub page with "Coming soon" badge.

- [ ] **Step 7: Verify no cross-zone 404s**

In the hub's portals selector and gate, all "live" portal links use raw `<a href>` (not next/link) — verify in browser dev tools that clicking them causes a full page load (no client-side navigation), and no 404s appear in the network tab.

- [ ] **Step 8: Final commit on branch**

If any minor fixes were made in the smoke test, commit them, then push the branch:

```bash
git push -u origin feat/single-origin-estate
```

---

## Self-review notes (for implementor)

**Spec coverage check:**
- §1 Problem → Tasks 1–2 (hub + orchestration)
- §2–3 URL map → Task 2 (rewrites) + Tasks 4–7 (basePath per app)
- §4 basePath compatibility sweep → Task 4 steps 3–12
- §5 Rewrites + env config → Task 2 step 3 (next.config.ts)
- §6 Storybook special case → Task 2 step 3 (with caveat comment in code); no separate task since dev-proxy approach is documented in the code, prod static export is deferred
- §7 Dev orchestration → Task 1
- §8 Hub UI → Task 3
- §9 Rollout order → Tasks are ordered exactly per spec §9
- §10 Success criteria → Task 9 verifies all criteria
- §11 Non-goals → nothing in this plan touches portal migration, real reports portal, or shared masthead

**Type consistency:** `PortalEntry` defined in Task 3 step 3, imported in Tasks 3 steps 5 only. `buttonClasses()` defined in Task 4 step 3, used in Tasks 4 steps 5–10.

**Known deferred item:** Storybook static export for production (`/design-system` in prod). The hub rewrite points at Storybook's dev port; in dev, Storybook's root-relative assets won't fully resolve through the proxy (open `localhost:6006` directly for Storybook development). The production solution (static export + file serving) is a separate task.
