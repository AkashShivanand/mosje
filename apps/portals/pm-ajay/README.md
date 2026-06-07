# PM-AJAY Dashboard — MoSJE Portal

Management information system (MIS) dashboard for **PM-AJAY** (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana), the flagship Scheduled-Caste development scheme of the **Ministry / Department of Social Justice & Empowerment (MoSJE)**, Government of India.

One of the functional portals under the MoSJE digital estate (see the workspace root `CLAUDE.md` / `MOSJE-ARCHITECTURE.md`).

## What's here

A faithful implementation of the Claude Design handoff for the PM-AJAY dashboard, built on the UX4G (UX for Government) design system from the MoSJE Portal Figma. Two views:

- **`/`** — the **6-view dashboard** (left scheme/section switcher): Executive Summary, Financial Management, GIA, Hostel, Adarsh Gram, Governance.
- **`/unified`** — the **Unified Programme Dashboard**: a single-screen bento view (KPI ribbon with target meters → fund-flow + utilization gauge + attention → scheme-delivery cards → state ranking + monthly trend), with a **Dashboard / All-Indicators (60)** toggle (searchable, sortable, group-filterable, CSV/Print export).

### The 6-view dashboard (`/`)

- **6 dashboards** — Executive Summary, Financial Management, Grant-in-Aid (GIA), Hostel Scheme, Adarsh Gram (PMAGY), Governance & Compliance.
- **60 KPIs** across the six views, with answer-first KPI cards (label → value → trend pill).
- **Drill-down** — FY / State-UT / District / Scheme / Period filter bar that rescales the data; click a table row to drill State → District; breadcrumb trail tracks the scope.
- **Charts** — fund-flow funnels, utilisation / occupancy / compliance donuts (with target markers), monthly bar charts, ranked state tables with status badges and progress bars. All custom accessible inline SVG.
- **Accessibility (WCAG 2.1 AA / GIGW)** — keyboard-operable listbox filters, `role="img"` + screen-reader data tables on every chart, sortable tables with `aria-sort`, visible focus rings, AA-contrast tokens, reduced-motion support.
- **Authentic MoSJE chrome** — navy Government-of-India utility bar, National Emblem lockup, Digital India + SAMAVESH marks.

The design is rendered at the Figma's native 1440px width and scaled-to-fit any viewport.

> Numbers are realistic but **synthetic** and internally consistent (Executive aggregates ≈ scheme-view sums). Wire to PFMS / scheme MIS APIs for production data.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript strict. Styling is the self-contained UX4G token + dashboard stylesheet in `src/app/globals.css` (Noto Sans, Material Symbols Rounded). No Tailwind/shadcn yet — transactional pages (login, forms) can layer in the shared `@mosje/design-system` when it lands.

## Commands

```bash
npm install
npm run dev        # http://localhost:4124
npm run build
npm run typecheck
npm run lint
```

## Structure

```
src/
  app/
    globals.css            # UX4G tokens + dashboard styles
    layout.tsx · page.tsx
  components/
    shell/navbar.tsx       # MoSJE Government-of-India chrome
    dashboard/
      dashboard-app.tsx    # shell: routing, filters, drill-down, scale-to-fit
      views.tsx            # the 6 dashboards
      ui.tsx               # KPI card, filter bar, sidebar, sortable table, etc.
      charts.tsx           # accessible inline-SVG chart primitives
  lib/
    data.ts                # 60-KPI synthetic data model + drill-down helpers
public/images/             # National Emblem, Indian Flag, Digital India, SAMAVESH
```
