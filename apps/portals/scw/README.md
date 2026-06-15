# SCW — Senior Citizens Welfare portal (visual replica)

Pixel-faithful **visual replica** of the two SCW UAT portals, consolidated into one Next.js app
on the shared `@mosje/design-system` token contract:

- **scw-admin-uat.mosje.in** → the `/admin/*` area (Officer/Admin)
- **scw-user-uat.mosje.in** → the citizen/beneficiary portal at the root, incl. SAGE & Volunteer roles

> Visual/frontend clone only — mock data, no backend/auth. Source data captured from the live UAT
> portals lives in `docs/research/scw-*-uat.mosje.in/INVENTORY.md`.

## Run

```bash
npm run dev        # http://localhost:4125/portals/scw  (or `npm run dev:scw` from repo root)
npm run build      # production build (22 routes)
npm run typecheck
```

Mounted through the hub at **`/portals/scw`** (basePath) — `npm run dev` from the repo root brings
up the whole estate; SCW is reachable at `localhost:3000/portals/scw`.

## Routes

| Area | Route | Screen |
|------|-------|--------|
| Auth | `/login` | SAMAVESH split-screen login (Citizen ↔ Officer; Volunteer/SAGE sub-toggle) |
| Citizen | `/` | Public home (service cards + helpline) |
| Citizen | `/epledge`, `/epledge/form` | E-Pledge + pledge form (OTP) |
| Citizen | `/our-services` | Service directory (map + facility list) |
| Citizen | `/sage-registration`, `/sage-registration/form` | SAGE eligibility + 6-step application wizard |
| Citizen | `/volunteer`, `/volunteer/dashboard` | Volunteer registration + opportunities dashboard |
| Citizen | `/sage/dashboard` | SAGE "My Applications" dashboard |
| Admin | `/admin/dashboard` | Stats + recent SAGE/volunteer tables + activity feed |
| Admin | `/admin/user-management` | Users table + Add User drawer |
| Admin | `/admin/sage-applications`, `/admin/sage-applications/[id]` | SAGE apps list + 5-tab detail (Approve/Reject) |
| Admin | `/admin/events`, `/admin/events/add` | Events list + create wizard |
| Admin | `/admin/volunteers`, `/admin/volunteers/[id]` | Volunteers list + detail (Approve/Reject) |
| Admin | `/admin/sage-homes` | IPSrC Homes directory |
| Admin | `/admin/assisted-devices` | RVY Assisted Devices catalogue |

## Structure

- `src/components/` — `admin-shell` / `user-shell` (gov chrome + sidebars), `ui.tsx` (StatusPill,
  DataTable, Pagination, Stepper, FieldGrid, form atoms…), `gov-chrome`, `sidebar`, `user-menu`.
- `src/lib/` — `mock-data.ts` (captured data), `states.ts`, `types.ts`, `utils.ts`.
- `public/brand/` — National Emblem, SAMAVESH, Digital India logos.

Brand axis: SAMAVESH government **navy**, emerald hero/approved green, amber "Awaiting Evaluation",
saffron helpline CTA; Noto Sans throughout. Tokens in `src/app/globals.css` + `tailwind.config.ts`.
