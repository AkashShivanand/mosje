# SAMBAL (NHAPOA) Portal — NHA-9 Final Verification

**Date:** 2026-07-06 · App: `apps/portals/nhapoa` · All 8 roles built (NHA-1…NHA-8).

## 1. Cross-role wiring — VERIFIED ✅

The full workflow spine was driven through the UI across all roles (each transition verified in-browser during its issue, plus a clean multi-role render smoke in NHA-9):

```
Citizen files → DO assigns → DO investigates → DO sends for approval
  → State Authority approves (or sends back → DO)
  → Finance disburses → case CLOSED
  → Citizen sees the full 7-step timeline in Track Status
```

- Citizen wizard writes a `SUBMITTED` case (source `citizen`); Call-Center writes one (source `call-center`) — both enter the DO queue.
- DO: `SUBMITTED → ASSIGNED → UNDER_INVESTIGATION → PENDING_APPROVAL` (verified).
- State Authority: `PENDING_APPROVAL → APPROVED` (→ Finance) and `→ SENT_BACK` (→ DO) (verified).
- Finance: `APPROVED → DISBURSED → CLOSED` atomically, with a transaction record (verified).
- Citizen Track Status shows the complete cross-role timeline of a CLOSED case (verified).
- System-Admin category add → appears in the Citizen wizard's category dropdown (verified — store-owned categories).
- Central-Authority fund allocation → reflected in fund tiles + state summary (verified).
- All 8 role dashboards render post-refactor (v4 store, store-owned categories, extracted wizard) — no regressions.

## 2. Design-system conformance — PASS ✅

- Hardcoded hex in TSX: **1** (a decorative SLA donut `conic-gradient` using the palette's approve-green) — acceptable.
- Non-Noto fonts: **none**. Material Symbols / lucide icons + Noto Sans throughout.
- Placeholder/lorem/TODO: **none**. Content is live-captured or statutory (PoA offence categories, real FAQ questions, real nav labels).

## 3. Hub live-status — PASS ✅

All three mandatory registration points present and **live**:
- `DEFAULT_APPS` entry (`packages/design-system/.../app-switcher-utils.ts`): path `/portals/nhapoa`, category "Social defence & welfare", `status: "live"`.
- `apps/hub/next.config.ts`: rewrite for `/portals/nhapoa` + `/:path*`.
- `apps/hub/src/proxy.ts`: ZONE probe (`/portals/nhapoa/login`, `dev:nhapoa`).
- Root `package.json`: `dev:nhapoa`, `check:nhapoa`, `lint:nhapoa` + in the `concurrently` fan-out. `.claude/launch.json`: nhapoa @ 4127.

## 4. Accessibility (WCAG 2.1 AA + GIGW) — audited + remediated

`accessibility-auditor` agent ran a full audit. Findings fixed in NHA-9:

**Critical (all fixed):**
1. `ink-hint` text contrast — token darkened `#94a3b8 → #64748b` (~4.8:1). Fixes labels, table headers, timestamps, hints across every screen.
2. Saffron text/CTA contrast — text-bearing usages moved to `saffron-600`, darkened `#d35912 → #b8500f` (AA with white); bright saffron retained for decoration only.
3. Login page skip link + `#login-main` target added.
4. Homepage `<main id="main">` landmark added (skip-link target now resolves).
5. Radio groups — new `Fieldset` (fieldset/legend) replaces the invalid `<label>`-wrapping-radios in the wizard.

**Serious (all fixed):** Stepper (`<nav>` + `aria-current="step"` + sr-only step labels); role-selection cards (`aria-pressed`); FAQ accordions (`aria-expanded` + `aria-controls`); shared case tables + DataTable (`scope="col"`); `await-fg` darkened for margin.

**Already compliant (confirmed by the audit):** DS `Modal` focus-trap / `aria-modal` / Escape / focus-restore; landmarks + skip links on all shell pages; labeled form fields; status conveyed by text + color (not color alone); focus rings never stripped without replacement; `<html lang>`; consistent nav chrome; GIGW font-scaling + high-contrast hooks + UX4G widget mounted.

**Remaining (minor, documented for follow-up):** inline admin list-table `<th>` could add `scope="col"` (shared tables done; single-header-row tables infer correctly); Devanagari inline text (संबल) could get `lang="hi"`; the dead "English" language button needs `aria-haspopup` once wired.

## 5. Gates — PASS ✅

`npm run typecheck`, `npm run lint`, and `npm run build` all pass for `apps/portals/nhapoa`.

## Status
**MACHINE-VERIFIED.** A machine draft cannot self-certify as WCAG/GIGW CERTIFIED — the remaining human track is: keyboard + screen-reader pass on a real AT stack, Hindi/RTL content review, and brand/GIGW sign-off, then flip to CERTIFIED.
