# NMBA features on the DoSJE homepage — design

**Date:** 2026-07-14
**Branch:** feat/nhapoa-portal-clone
**Apps touched:** `apps/dosje` (website), `apps/portals/nmba` (portal)
**Source of truth for content:** legacy site https://nmba.dosje.gov.in/

## Goal

Add three Nasha Mukt Bharat Abhiyaan (NMBA) features to the DoSJE website home page:

1. **De-addiction Map** — a public, no-login map so citizens can locate nearby
   De-addiction Centres (Nasha Mukti Kendra).
2. **Dual Pledge System** — two front-page pledge options (Non-Users and Recovered
   Users) that route to the NMBA portal via distinct URL channels.
3. **Register as Nasha Mukti Mitr** — an entry point to a volunteer registration page.

## Decisions locked with the user

| Question | Decision |
|----------|----------|
| Map on homepage | **Full interactive Leaflet map** embedded on the landing page. |
| NMBA e-Pledge changes | **DoSJE side only for now** — two distinct channel links; NMBA e-Pledge page left unchanged for a later backend task. |
| Nasha Mukti Mitr target | **Build a public registration page in the NMBA portal**; homepage CTA points to it. |
| Placement | **Build all three placement options (A/B/C)** and provide a preview to finalise with the client. Live homepage defaults to recommended Option B. |

## Real content (from legacy NMBA site)

- **Dual pledge channels** (confirmed live): general e-pledge ("Take e-pledge now!")
  and recovered-users pledge ("Take a pledge now!"). Counters: **25,20,056** e-pledges;
  **6,60,523** recovered drug users pledged.
- **Centre types & counts:** IRCA 348 · CPLI 45 · ODIC 76 · DDAC 145 · ATF 154 —
  **768** total centres.
- **Reach stats:** 23 crore+ individuals · 7.81 crore youth · 5.24 crore women ·
  17 lakh educational institutions.
- **Helpline:** 14446.
- **Pledge text (reference only; NMBA side deferred):** "I pledge that I will do
  everything possible to the best of my ability to make my country drug-free."
- **Nasha Mukti Mitr registration fields (legacy):** Name, DOB, Gender, Mobile, Email,
  OTP, Highest Qualification, Affiliation, Specify Affiliation, School/College/Org Name,
  Complete Postal Address, State, District, Pincode, Captcha, Declaration checkbox.

## Architecture

### DS audit
- Section shell / heading / subtitle — **reuse** existing dosje pattern
  (`mx-auto max-w-[1280px] px-4 py-12 md:py-16`, `text-[32px] font-semibold text-gov-blue-dark`).
- `Card`, `Button`, `FormField`, `Input`, `Select` — **existing** from `@mosje/design-system`.
- Icons — Lucide (dosje convention).
- **Interactive map** — **new per-app**: add `react-leaflet` + `leaflet` to `apps/dosje`
  and a dosje-local `DeAddictionMap` (dynamic import, `ssr:false`). Leaflet stays per-app
  (mirrors pm-ajay's hand-rolled charts), NOT in the shared DS package.
- **Facility data** — **new** `apps/dosje/src/content/deaddiction-centres.ts`, same shape
  as NMBA's `FACILITIES` (type/name/address/state/lat/lng), seeded with representative
  centres across states.

### DoSJE components — `apps/dosje/src/components/nmba/`
1. **`DeAddictionMap.tsx`** (`"use client"`) — Leaflet map centred on India, colour-coded
   pins per centre type, a legend, and a State/District filter that pans/filters pins.
   A summary strip shows the five type counts + total (768) and helpline 14446.
   Framed "No login required."
2. **`DualPledge.tsx`** — two cards:
   - **Non-User** → `<a href="/portals/nmba/epledge?channel=non-user">`
   - **Recovered User** → `<a href="/portals/nmba/epledge?channel=recovered">`
   Plain `<a>` (cross-app link; must bypass dosje's `/website` basePath). Each card shows
   its live counter (25,20,056 / 6,60,523) and a one-line description.
3. **`NashaMuktiMitr.tsx`** — CTA card → `<a href="/portals/nmba/register-mitr">`.
4. **`NashaMuktBharat.tsx`** — unified section composing (1)+(2)+(3) under one
   "Nasha Mukt Bharat Abhiyaan" heading + subtitle. Accepts a `variant` prop
   (`"full" | "band"`) so the split option can render a compact action band.

### Placement + preview
- **Live homepage** (`apps/dosje/src/app/page.tsx`): insert `<NashaMuktBharat />`
  **after `<LatestUpdates />`** (Option B, recommended).
- **Preview** (`apps/dosje/src/app/nmba-placement-preview/page.tsx`): an A/B/C segmented
  switcher (client component) that re-renders the homepage section stack with the NMBA
  content placed per option:
  - **A** — unified section after PortalBanner (mid-page)
  - **B** — unified section after LatestUpdates (high)
  - **C** — compact pledge+Mitr band after Hero; full map section before RecentDocuments
  Reuses the real homepage section components so it is faithful. Not linked in nav
  (internal review surface).

### New NMBA page — `apps/portals/nmba/src/app/register-mitr/page.tsx`
- Public (no auth), rendered in `PublicShell`.
- Intro explaining who a Nasha Mukti Mitr is (community volunteer for drug-demand
  reduction: prevention, awareness, outreach).
- Simplified faithful form: Name, Age/DOB, Gender, Mobile, Email, Highest Qualification,
  Affiliation, Organisation Name, Address, State, District, Pincode, Declaration checkbox.
  Reuses `STATES` / `STATE_DISTRICTS`. Controlled state; mock submit → success panel +
  toast (demo-friendly, no real OTP/captcha).
- Add a `demo-fab`/`DemoFab` fill helper is not required (public form), but keep fields
  demo-fillable.

## Data flow
- Map: static seed array → filtered in the client by selected state/district.
- Pledge: no data written on dosje; the channel is carried as a query param to NMBA.
- Mitr: form state local; mock submit (no backend).

## Error handling
- Map: `ssr:false` dynamic import with a skeleton fallback; empty-filter state shows a
  "no centres listed for this district yet" message.
- Mitr form: required-field validation via native + controlled checks; mobile pattern
  `[0-9]{10}`; pincode `[0-9]{6}`.

## Testing / verification
- `npm run dev:website` (dosje at :3001) — verify homepage renders the section, map
  loads (Leaflet tiles), filter works, pledge links carry the correct channel param,
  Mitr CTA points at `/portals/nmba/register-mitr`.
- `npm run dev:hub` end-to-end — confirm cross-app links resolve (dosje `/website` →
  `/portals/nmba/...`).
- `npm run dev` for NMBA — verify `/portals/nmba/register-mitr` renders and mock submit
  shows success.
- `npm run lint` + `npm run typecheck` in both apps.
- Accessibility pass (WCAG 2.1 AA / GIGW): map has aria-label, pins have accessible
  names, form fields labelled, focus visible, AA contrast.

## Out of scope (later tasks)
- NMBA e-Pledge page reading `?channel=` and tagging submissions.
- Real Mitr backend (OTP, captcha, persistence).
- Real geocoded centre dataset (seed data used for now).
