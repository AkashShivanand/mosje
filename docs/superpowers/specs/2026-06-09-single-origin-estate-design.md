# Single-Origin Estate — Design Spec

> Unify the MoSJE website, design system, and workflow portals behind **one URL** with a root
> landing gate, using a Hub app + Next.js Multi-Zones. Production-agnostic, deploy via env-driven
> rewrites. Architect for production; build local-dev first.

- **Date:** 2026-06-09
- **Status:** Approved design → ready for implementation plan
- **Approach:** A — Hub app + Next.js Multi-Zones (chosen over a dev-only proxy and a full monorepo merge)

---

## 1. Problem

Today the estate is four+ independent apps launched on separate ports:

| App | Stack | Port (old) |
|-----|-------|-----------|
| `apps/dosje` | Next 16 · React 19 · Tailwind v4 · shadcn | 3000 |
| `apps/portals/smile-admin` | Next 15 · React 19 · Tailwind v3 · Radix | 4123 |
| `apps/portals/pm-ajay` | Next 15 · React 19 · Tailwind v3 | 4124 |
| `apps/portals/eutthan-admin` | Next 15 · React 19 · Tailwind v3 | 4125 |
| `apps/docs` | Storybook (SAMAVESH DS docs) | 6006 |

There is no single entry point, no shared navigation surface, and no place to choose between the
website, the design system, and the portals. We want one origin with a landing gate where the user
picks a destination, the portals linked from the website the way they are on the live `dosje.gov.in`,
and room to add a future QC/Audit reports portal.

### Why not merge into one app

`dosje` (Next 16 / Tailwind v4) and the portals (Next 15 / Tailwind v3) have real version drift.
Merging into a single Next app would require migrating every portal's framework + styling layer and
would couple every release together, destroying per-app deploy independence. Rejected (Approach C).

### Why not a dev-only proxy

A throwaway path→port proxy for local dev would still hit `/_next/*` asset collisions between apps
(forcing `basePath`/`assetPrefix` anyway) and would need an entirely separate production solution.
We'd do most of Multi-Zones' work without its production payoff. Rejected (Approach B).

---

## 2. Approach — Hub + Multi-Zones

A new **`apps/hub`** (Next 16, consumes `@mosje/design-system` + Noto Sans) is the **root zone**. It
owns the landing gate and the cross-cutting chooser pages, and holds the `rewrites()` table that
forwards each path prefix to the relevant app's upstream URL.

Each child app is mounted at a path prefix via Next's `basePath`. Next then auto-prefixes all
`next/link`, `next/image`, and `/_next/*` asset URLs with that prefix, so **zones never collide on
assets** and the per-app code change is minimal.

This is Vercel's official Multi-Zones pattern. The same config runs in local dev and in production —
only the upstream URLs differ, and those come from environment variables.

---

## 3. URL map (one origin — local and prod identical)

```
/                          → apps/hub                      landing gate (Website · Design System · Portals · Reports)
/website        /website/* → apps/dosje                    unified DoSJE website
/design-system             → apps/docs                     SAMAVESH Storybook (static export; special case)
/portals                   → apps/hub                      portal selector
/portals/pm-ajay/*         → apps/portals/pm-ajay
/portals/smile-admin/*     → apps/portals/smile-admin
/portals/eutthan-admin/*   → apps/portals/eutthan-admin
/reports        /reports/* → apps/hub                      QC/Audit reports — "coming soon" stub now
```

Decisions baked in:
- **The website lives at `/website`, not root.** Root (`/`) is the gate.
- **Design system mounts at `/design-system`.**
- **The gate is a navigation chooser, not a login.** "Gating" means a decision page. Each portal's
  own internal authentication is untouched.
- Cross-zone links (e.g. website nav → a portal) are ordinary same-origin `<a href="/portals/...">`
  links. Navigation across zones is a normal full-page load — expected and acceptable.

---

## 4. `basePath` mounting — per app

| App | `basePath` | Notes |
|-----|-----------|-------|
| `apps/dosje` | `/website` | |
| `apps/portals/smile-admin` | `/portals/smile-admin` | |
| `apps/portals/pm-ajay` | `/portals/pm-ajay` | drop the orphaned `/unified` route if still present |
| `apps/portals/eutthan-admin` | `/portals/eutthan-admin` | |
| `apps/docs` (Storybook) | `/design-system` | **special case — see §6** |

### basePath compatibility sweep (main implementation risk)

`basePath` auto-prefixes framework-managed URLs but **not**:
- hardcoded `<a href="/...">` anchors,
- `fetch('/api/...')` / absolute client-side request paths,
- CSS `url(/...)` references and other hardcoded absolute asset paths,
- absolute paths in manifest/metadata/`public/` references.

Each app gets a sweep to find absolute paths and either switch them to framework helpers
(`next/link`, `next/image`) or prefix them via the app's known base (e.g. a small `withBase()` helper
reading `basePath` config). This sweep is the bulk of the per-app work and must be verified in the
browser before moving to the next app.

---

## 5. Hub rewrites + env config (deploy-agnostic)

The hub's `next.config` `rewrites()` reads each zone's upstream **base URL from an environment
variable**, so the same code serves local dev and any production topology (Vercel multi-zone projects,
a single VPS + nginx, or containers). Concrete hosting is deferred.

Environment variables (illustrative names):

```
HUB_ZONE_WEBSITE_URL          # dev: http://localhost:3001     prod: deployed dosje upstream
HUB_ZONE_DS_URL               # dev: http://localhost:6006     prod: static DS upstream
HUB_ZONE_SMILE_ADMIN_URL      # dev: http://localhost:4123     prod: deployed smile-admin upstream
HUB_ZONE_PM_AJAY_URL          # dev: http://localhost:4124     prod: deployed pm-ajay upstream
HUB_ZONE_EUTTHAN_ADMIN_URL    # dev: http://localhost:4125     prod: deployed eutthan-admin upstream
```

Rewrite rules forward `/<prefix>/:path*` (and the zone's `/<prefix>/_next/:path*`) to
`${ZONE_URL}/<prefix>/:path*`. Local defaults fall back to the localhost ports above when the env var
is unset, so `npm run dev` works with zero configuration. A `.env.example` documents every variable;
real `.env*` files are never committed (per project safety rules).

---

## 6. Storybook (`apps/docs`) — the one special case

Storybook is not a Next app, so `basePath` does not apply.

- **Production:** build a static Storybook export configured to be served under `/design-system`, and
  let the hub serve/forward those static files at that prefix.
- **Local dev:** run the Storybook dev server (6006) and forward `/design-system/*` to it. Storybook's
  HMR uses websockets, so the dev rewrite must be websocket-aware (or, as a simpler fallback, the gate
  links directly to the Storybook dev port in local dev and only the production path is unified). The
  plan will pick whichever is verified to work cleanly; the static-export-in-prod behavior is the
  contract that matters.

---

## 7. Dev orchestration — "one command, one URL"

Root `npm run dev` boots all apps concurrently (via a concurrent-runner dev dependency). The **hub on
`localhost:3000` is the single entry point.** Reassigned ports:

| App | Port | Mount |
|-----|------|-------|
| hub | **3000** | `/` |
| dosje | 3001 | `/website` |
| docs (Storybook) | 6006 | `/design-system` |
| smile-admin | 4123 | `/portals/smile-admin` |
| pm-ajay | 4124 | `/portals/pm-ajay` |
| eutthan-admin | 4125 | `/portals/eutthan-admin` |

`.claude/launch.json` and any `preview_start` configs are updated to match (hub added, dosje moved to
3001). Individual `npm --prefix <app> run dev` still works for isolated per-app development.

---

## 8. The hub app UI (the only new UI)

On-brand: SAMAVESH identity, Noto Sans, `@mosje/design-system` tokens/components, WCAG 2.1 AA + GIGW.

### `/` — landing gate
Four destination cards:
1. **Website** → `/website`
2. **Design System** → `/design-system`
3. **Portals** → `/portals`
4. **Reports** → `/reports` (rendered but marked "Coming soon")

### `/portals` — portal selector
A grid of portal cards driven by a **single data file** (seeded from `MOSJE-ARCHITECTURE.md`'s portal
registry). Built portals link through; planned portals render disabled with a "Planned" badge. Adding
a portal later = one entry in the data file. This scales to all 20 portals without UI rework.

### `/reports` — stub
A placeholder page describing the future QC/Audit reports portal. No real reporting functionality yet.

**Out of scope (future):** a shared global masthead/footer rendered across all zones. For now each app
keeps its own chrome; the hub only provides the gate, the selector, and the reports stub. A shared
shell can be designed later if desired.

---

## 9. Rollout order (incremental — nothing breaks mid-migration)

1. Scaffold `apps/hub` + root `dev` orchestration. All apps still reachable on their (reassigned)
   ports; hub rewrites added incrementally.
2. Mount `dosje` at `/website` (`basePath` + sweep). Verify in browser.
3. Mount each portal one at a time (`pm-ajay`, `smile-admin`, `eutthan-admin`), verifying each.
4. Mount Storybook at `/design-system` (§6).
5. Build the gate, the portal selector, and the reports stub.
6. Update `MOSJE-ARCHITECTURE.md` and `CLAUDE.md` to document the single-origin model and new ports.

---

## 10. Success criteria

- `npm run dev` at repo root brings up **one URL** (`localhost:3000`) that reaches the website, the
  design system, all three portals, the portal selector, and the reports stub.
- The root gate lets a user choose Website / Design System / Portals / Reports.
- `/portals` lists built portals (link through) and planned portals (disabled), driven by one data file.
- The website links to portals as same-origin `/portals/...` links, mirroring the live site.
- Each app keeps its independent stack, version, and standalone dev command.
- The hub's rewrites are env-driven and contain no hardcoded production hostnames, so the same build
  deploys to any topology.
- No `/_next/*` asset collisions; each mounted app renders correctly under its prefix.

---

## 11. Non-goals

- Migrating portals to Next 16 / Tailwind v4 (deferred; not required by this design).
- Building the real QC/Audit reports portal (stub only).
- A shared cross-zone masthead/footer (future).
- Choosing concrete production hosting (kept abstract; env-driven).
- Any change to portals' internal authentication.
