# SMILE Beggary Rehabilitation Portal — Recreated

A Next.js 15 recreation of the **SMILE Admin Portal** (Ministry of Social Justice & Empowerment, Government of India), the operations console for **SMILE — Support for Marginalised Individuals for Livelihood & Enterprise**, the central scheme covering identification, mobilisation, shelter and rehabilitation of persons engaged in the act of beggary.

Built by reverse-engineering the live application at `smile-admin-dev.mosje.in/dashboard` and applying the **Samavesh** design language from the Figma handoff file.

> **Samavesh** (समावेश) — *Single Access Mechanism for All Verticals of Empowerment & Social Harmony.*

---

## What's in this repo

A full-fidelity Next.js / TypeScript / Tailwind / shadcn-style admin portal covering all 44 routes from the live SMILE app, themed with the Figma design tokens, and wired with mock data so every screen renders end-to-end.

### Highlights

- **6 mock accounts** (Super / Central Admin, State NO, three District NOs) with `Password@123`
- **Role-scoped sidebar** that narrows based on signed-in role
- **Role-scoped dashboard** — Super Admin sees an all-India choropleth; State NO sees the state highlighted; District NO sees district-level KPIs
- **India choropleth map** rendered with d3-geo + TopoJSON (state-wise beneficiary distribution)
- **Government-grade accessibility bar** — font scaling, high-contrast theme, language switch, skip-link (GIGW 3.0 pattern)
- **All Figma design tokens** wired into Tailwind: primary navy `#003366`, semantic color scale, Noto Sans type ramp, 8-step spacing, radii, shadows
- **Production build clean** — `tsc --noEmit` passes, `next build` ships all 46 routes (static + dynamic)

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15.0.3 (App Router, Turbopack dev) |
| Language | TypeScript 5 |
| React | 19 RC |
| Styling | Tailwind CSS 3.4 with Figma design tokens |
| Primitives | Radix UI (Select, Checkbox, Tabs, Tooltip, Dropdown, Switch, Label, Slot) |
| Charts | Recharts |
| Map | d3-geo + d3-scale + topojson-client |
| Icons | lucide-react |
| Fonts | Noto Sans (Latin + Devanagari) via `next/font/google` |

---

## Quick start

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run the dev server (Turbopack, port 4123)
npm run dev

# 3. Open
open http://localhost:4123/login
```

> The `--legacy-peer-deps` flag is needed because we pin React 19 RC and a few Radix peers haven't bumped their peer ranges yet.

### Sign in

Any of these test accounts work — all use password `Password@123`:

| Role | Mobile | Scope |
|---|---|---|
| Super Admin | `9000000900` | All India |
| Central Admin | `9000000901` | All India |
| State Nodal Officer | `9000000902` | Maharashtra |
| District NO (Mumbai) | `9000000903` | Maharashtra / Mumbai |
| District NO (Pune) | `9000000904` | Maharashtra / Pune |
| District NO (New Delhi) | `9000000905` | Delhi / New Delhi |

The login page also has quick-fill chips for each.

### Other scripts

```bash
npm run build     # production build (next build)
npm run start     # serve the production build on :4123
npm run lint      # next lint (ESLint)
npm run typecheck # tsc --noEmit
```

---

## Project structure

```
.
├── .claude/launch.json          # Claude Code dev-server config
├── public/
│   └── india-states.topo.json   # TopoJSON for the choropleth
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Noto Sans, AppProvider
│   │   ├── globals.css          # CSS variables, GIGW a11y modes
│   │   ├── page.tsx             # /  →  /login or /dashboard
│   │   ├── (auth)/              # Login, Forget password, Reset password
│   │   └── (app)/               # 38 protected pages — Dashboard, Persons,
│   │                            #   Roles, Permissions, Performance Stats,
│   │                            #   Users, Schemes, Shelter Homes, MIS Reports,
│   │                            #   Fund Monitoring, Notifications, Audit Log,
│   │                            #   Immediate Review, Master Settings, …
│   ├── components/
│   │   ├── ui/                  # button, input, label, card, badge, table,
│   │   │                        #   select, checkbox, switch, tabs, tooltip,
│   │   │                        #   empty-state
│   │   ├── shell/               # access-bar, header, sidebar, footer,
│   │   │                        #   breadcrumbs, page-header, scope-banner,
│   │   │                        #   coming-soon
│   │   ├── dashboard/           # india-map, kpi-card, system-users-rail,
│   │   │                        #   charts (donut, bars, lines), date chips
│   │   └── data/                # data-toolbar, search-field, stat-pill
│   ├── lib/
│   │   ├── utils.ts             # cn(), formatINR(), formatNumber(), initials()
│   │   ├── roles.ts             # account list + role labels + scope labels
│   │   ├── nav.ts               # role-aware sidebar config
│   │   ├── states.ts            # 36 states + UTs with TopoJSON name map
│   │   └── mock-data.ts         # KPIs, beneficiaries, roles, schemes,
│   │                            #   shelters, surveys, funds, audit, …
│   └── store/
│       └── app-context.tsx      # Auth, font-scale, contrast, sidebar state
├── tailwind.config.ts           # Figma design tokens → Tailwind theme
└── package.json
```

---

## Design tokens

All extracted from the Figma file (`gH2vQ62cfg4677YKWuOpLc` → page "Smile Beggary" → frames Dashboard, Users, Roles & Permissions, Performance Statistics, plus the Login/Signup page for the auth flow). Wired into `tailwind.config.ts` and `src/app/globals.css`.

### Color

| Token | Hex |
|---|---|
| Primary 500 (brand) | `#003366` |
| Primary 50 → 800 | `#e5eff9` `#c8dbf0` `#9cbfe3` `#6da1d5` `#003366` `#002b55` `#002244` `#001933` |
| Secondary 500 | `#198754` |
| Info 600 | `#1558b0` |
| Success 600 | `#27682a` |
| Warning 600 | `#a66a26` |
| Danger 600 | `#d64539` |
| Neutral 600 | `#4b5563` |

### Type ramp (Noto Sans)

`display-5` `headline-1..4` `headline-6` `title-1..2` `body-1..3` `label-1..3`
— sizes 32 / 28 / 24 / 20 / 18 / 16 / 14 / 13 / 12 / 11 with matching line heights from Figma.

### Spacing scale

`xxs(2) · xs(4) · sm(8) · md(12) · lg(16) · xl(20) · 2xl(24) · 3xl(32)`

### Radii

`xxs(2) · xs(4) · sm(6) · md(8) · lg(12) · xl(16) · 2xl(20) · full`

### Shadows

`shadow-s` and `shadow-md` — both two-layer drop shadows from the Figma effect styles.

---

## Routes (44 total)

Discovered by parsing the live application's JS bundle (`/static/js/main.*.js`) and matched against the live sidebar.

### Auth `(auth)` route group
- `/login` · `/forget-password` · `/reset-password`

### App `(app)` route group
- `/dashboard`
- **Access Control** — `/users` · `/users/onboard` · `/ia-approvals` · `/ia-list` · `/ia-list/:userId` · `/surveyors` · `/surveyors/:userId` · `/surveyor-list` · `/surveyor-list/:userId` · `/do-list` · `/do-list/:userId` · `/roles` · `/roles/:roleId/edit` · `/permissions`
- **Field Operations** — `/survey-locations` · `/survey-locations/create` · `/surveyor-mapped` · `/surveys` · `/surveys/create` · `/surveys/:surveyId` · `/survey-list` · `/survey-list/:submissionId` · `/beggary-schemes` · `/beggary-schemes/:id`
- **Beneficiaries** — `/persons` · `/persons/under-mobilized` · `/persons/mobilized` · `/persons/shelter-home` · `/persons/:id` · `/shelter-homes` · `/shelter-homes/beneficiaries` · `/shelter-homes/checklist` · `/comprehensive-rehab/skill-training` · `/comprehensive-rehab/data`
- **Reports & Analytics** — `/performance-stats` · `/fund-monitoring` · `/fund-monitoring/sanction-orders/create` · `/fund-monitoring/nisd-releases/create` · `/fund-monitoring/nodal-officer-onward-releases/create` · `/mis-reports/mobilised` · `/mis-reports/rehabilitated` · `/mis-reports/beneficiary` · `/mis-reports/shelter-home` · `/mis-reports/ia-agency-institute` · `/mis-reports/survey-location`
- **Communications** — `/notifications` · `/notifications/compose`
- **System** — `/master-setting` · `/master-setting/shelter-homes` · `/audit-log` · `/immediate-review`

Pages with full UI (tables, forms, charts):
**Dashboard, Persons (list + detail), Roles (list + editor), Permissions, Performance Statistics, Users (list + onboard), Beggary Schemes (list + detail), Shelter Homes, Survey Locations (list + create), Notifications (list + compose), Fund Monitoring, Audit Log, Immediate Review**.

Other routes render with the proper shell, breadcrumbs and a "module under construction" placeholder — they are wired into routing and ready to fill in.

---

## Accessibility

Following the **Guidelines for Indian Government Websites (GIGW 3.0)**:

- Skip-to-main-content link
- Three font-scale levels (small / default / large) persisted in localStorage
- High-contrast theme that swaps surface, foreground, primary and ring tokens to a yellow-on-black palette
- Visible 2-px focus ring on all interactive elements
- `prefers-reduced-motion` disables transitions
- Semantic HTML throughout (`<nav>`, `<aside>`, `<main>`, `<header>`, `<footer>`, breadcrumb `aria-label`)

---

## What's *not* in this repo

- A real backend. All data is in `src/lib/mock-data.ts`. Auth is a localStorage shim.
- The live app's exact API contracts — the route map is authoritative, but request/response shapes are unknown without authenticated API documentation.
- Detailed forms for some specialised modules (NISD release order PDFs, comprehensive rehab schemas, master-setting reference tables). Those routes render the "Module under construction" placeholder so the navigation is complete; populate them from the live API when wiring up the backend.

---

## License & attribution

This is a UI recreation. The **SMILE programme** and the **Samavesh** name are property of the Ministry of Social Justice & Empowerment, Government of India. Use of this code outside of authorised SMILE / MoSJE work should be coordinated with the ministry.
