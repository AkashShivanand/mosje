# NMBA Mass Pledge Reporting (18 August 2026)

**Status:** Draft spec, pending leadership confirmation of assumptions A1–A11
**Source requirement:** "NMBA Mass Pledge Reporting Form (18 August 2026 Only)" (Google Doc, owner: DoSJE, modified 2026-07-20)
**Event date:** 18 August 2026 · **Spec date:** 21 July 2026 · **Runway:** 28 days

---

## Context

The Ministry runs a single-day National Pledge Against Drug Abuse on 18 August 2026. Five categories of organisation report their participation figures and photographic evidence on that day: State/UT/District/Block administrations, Line Ministries, Spiritual Organisations, Higher Education Institutions, and GIAs. Approved figures roll up into a national total.

Today the NMBA portal has no way to capture this. Its existing pledge surfaces are for the **individual** e-Pledge (one row per citizen: name, age, mobile, district) at [pledge-form.tsx](../../../apps/hub/src/components/nmba/pledge-form.tsx) and [pledge-reports/page.tsx](../../../apps/hub/src/app/portals/nmba/admin/(protected)/pledge-reports/page.tsx). This module is a different entity: **institutional aggregate reporting** with an approval chain. The two must not be merged, and their dashboards must never sum together.

The source document specifies field shapes but leaves eleven decisions open. Rather than block, this spec resolves each one to what we judge the correct answer, labels it **A1–A11**, and surfaces it in the UI where a reviewer will actually notice it. After the build, these become the redrafted clarification note for leadership to confirm or overturn. Every assumption is isolated to one config object so a reversal is a value change, not a rewrite.

---

## Current State (verified 21 July 2026)

| Fact | Evidence |
|---|---|
| No backend anywhere in the estate | No API routes outside `src/app/design-system/*`; no DB/ORM/auth deps in `apps/hub/package.json` |
| House persistence pattern is localStorage + seed | [committee/store.tsx:1-14](../../../apps/hub/src/lib/nmba/committee/store.tsx), `useSyncExternalStore`, hydration-safe |
| Session is a JSON cookie, roles ADMIN/STATE/DISTRICT | [committee/session.ts:9-48](../../../apps/hub/src/lib/nmba/committee/session.ts), cookie `nmba_admin_session` |
| No BLOCK role exists | `PortalRole` at [committee/types.ts:57](../../../apps/hub/src/lib/nmba/committee/types.ts) |
| No block master data | [states.ts](../../../apps/hub/src/lib/nmba/states.ts) has `STATES` + `STATE_DISTRICTS` only |
| Scope helpers already model tier visibility | [committee/scope.ts:19-59](../../../apps/hub/src/lib/nmba/committee/scope.ts) |
| Protected layout redirects unauthenticated | `app/portals/nmba/admin/(protected)/layout.tsx` |
| Demo accounts keyed by mobile | [committee/masters.ts:37-64](../../../apps/hub/src/lib/nmba/committee/masters.ts) |
| Committee uploads do NOT survive reload | blob URLs, [committee/types.ts:11-17](../../../apps/hub/src/lib/nmba/committee/types.ts) |
| `MediaGalleryInput` uses data-URLs, which DO persist | `packages/design-system/components/forms/media-gallery-input.tsx:9-17` |

**The NAPDDR three-tier module is the architectural precedent.** It already solves role-scoped tier visibility with the exact State/District/Block shape this requirement needs. We extend it rather than parallel it.

---

## Design System Audit (mandatory per CLAUDE.md)

Existing, import directly: `Button` `Input` `Select` `Textarea` `Checkbox` `FormField` `FormSection` `FormCard` `Wizard` `Stepper` `Alert` `Badge` `Modal` `Lightbox` `EmptyState` `Toast` `DataTable` `MetricCard` `KpiRow` `DashboardGrid` `ChartCard` `FilterBar` `SegmentedControl` `PortalLoginShell` `DemoFab` `MediaGalleryInput` `Icon`.

Adding to `packages/design-system/` **before** any portal code:

| Component | Why it belongs in the DS |
|---|---|
| `GeoPhotoInput` | Wraps `MediaGalleryInput` with geolocation capture, EXIF GPS read, downscaling and a location chip. Every future field-reporting portal needs this. |
| `ApprovalTimeline` | Renders a submitted → approved chain with actor, timestamp and remarks. SMILE and PM-AJAY both have approval flows that currently hand-roll this. |
| `DeclarationCheckbox` | Certification checkbox with legal-text slot and required-state handling. Reused by any statutory form. |

Nothing else is hand-built. No one-off buttons, cards, tables or inputs in portal code. No hardcoded hex, spacing or font values: brand tokens only, Noto Sans, Material Symbols Rounded via `<Icon>`.

---

## Assumptions A1–A11 (the resolved clarifications)

Each renders in the UI as a small "?" affordance next to the field it governs, opening a popover with the assumption text and an "Awaiting Ministry confirmation" badge. They also collect into one review page at `/portals/nmba/admin/mass-pledge/assumptions` so leadership can walk the whole list.

| # | Open question | Resolution we build to |
|---|---|---|
| **A1** | Youth / Women / Others overlap, and Total sums them | Redefined as a true partition, so the sum is arithmetically valid. **Youth** = participants under 30, any gender. **Women** = female participants aged 30+. **Others** = everyone else (males 30+, other genders 30+). Helper text on each field. `Total` is computed and read-only. |
| **A2** | Same event reportable by a State (Form 1) and by its coordinating Ministry (Form 2) | The Form 1 "Coordinating Line Ministry" field is **attribution only**. It never creates a Ministry-side figure. Form 2 is exclusively for events a Ministry organised itself. The dashboard shows ministry attribution as a separate view, never added to the ministry's own total. On-form notice states this. |
| **A3** | Whether tier figures can be safely added | Each tier reports **only events it organised directly**. National total = Block + District + State + all other forms. Helper text states it. |
| **A4** | What "geo-tagged" must prove | Prefer EXIF GPS when present; otherwise capture `navigator.geolocation` at upload and stamp lat/long/accuracy/time. **Never reject a photo for missing EXIF** (forwarded photos always lose it). If location is unavailable, submission proceeds with a `locationUnavailable` flag and is surfaced to the approver for judgement rather than hard-blocked. |
| **A5** | 10MB per photo or total | **Per photo.** 1 minimum, 4 maximum, JPEG/PNG only. |
| **A6** | Routing when the coordinating agency is not SJE | Routing is **identical regardless of coordinating ministry**. Block → District → State → Dashboard, with entry at any tier. The ministry field does not alter the chain. |
| **A7** | No rejection path in the workflow | Approvers get **Approve** or **Return with remarks**. Returned submissions become editable by the submitter with remarks shown, and resubmit re-enters at the same tier. Full audit trail on every transition. Pending figures are excluded from published totals and visible internally as "Pending". |
| **A8** | Forms 2–5 sit outside the approval chain | They publish on submit, tagged **self-declared**. Chain-approved figures are tagged **verified**. The dashboard shows both, always distinguishable, never silently blended. |
| **A9** | Authentication for Line Ministries / Spiritual Orgs / HEIs, and block logins | All five forms are behind login. Ministry/Org/HEI accounts are pre-provisioned one per entity. Block accounts seeded from LGD. Reporting officer mobile is OTP-verified at submit (mocked in prototype: any 6 digits, with the code shown on screen). |
| **A10** | Is 18 Aug the event date or the submission window | Event date is **locked to 18-08-2026, read-only**. Submission window is **18–25 August 2026**. Outside it the form is closed with a clear message. A dev-only override lets reviewers see the pre-window, open and closed states. |
| **A11** | Ministry list, 8 spiritual organisations, HEI list not supplied | Seeded with real public data where it exists (Government of India ministries; a representative set of central universities/IITs/NITs). The eight spiritual organisations are seeded as clearly marked **PLACEHOLDER** entries. All three lists live in one file and are swap-in replaceable. |

---

## Proposed Change

### Route map

```
apps/hub/src/app/portals/nmba/
├── mass-pledge/                          PUBLIC
│   └── page.tsx                          live counter (approved figures only)
└── admin/(protected)/mass-pledge/
    ├── page.tsx                          my submissions + "Report participation" CTA
    ├── new/page.tsx                      the form, identity header resolved by role
    ├── [id]/page.tsx                     submission detail, timeline, approve/return
    ├── approvals/page.tsx                inbox, approver roles only
    ├── dashboard/page.tsx                national + state rollup
    └── assumptions/page.tsx              A1–A11 review page for leadership
```

### One form, five identity headers

The five documented forms share an identical body. Build **one** `MassPledgeForm` with a pluggable `<IdentityHeader>` slot. Five thin wrappers, zero duplicated field logic.

| Form | Identity header | Resolution |
|---|---|---|
| 1 · State/UT/District/Block | Coordinating Ministry `Select` + read-only State/District/Block | Scope from session |
| 2 · Line Ministry | Ministry `Select` with "Others" → `Input` | From session, editable |
| 3 · Spiritual Organisation | Org `Select` (8) | From session |
| 4 · HEI | HEI `Select` with "Others" → `Input` | From session |
| 5 · GIA | Read-only GIA name | From session |

### Data model

```ts
// apps/hub/src/lib/nmba/mass-pledge/types.ts
export type ReporterKind = "ADMIN_TIER" | "LINE_MINISTRY" | "SPIRITUAL_ORG" | "HEI" | "GIA";
export type SubmissionStatus = "DRAFT" | "PENDING_DISTRICT" | "PENDING_STATE" | "APPROVED" | "RETURNED";
export type VerificationTag = "VERIFIED" | "SELF_DECLARED";       // A8

export interface GeoPhoto {
  id: string;
  thumbDataUrl: string;        // 320px, persisted
  viewDataUrl: string;         // 1600px longest edge, JPEG q0.72, persisted
  originalName: string;
  originalBytes: number;
  mime: "image/jpeg" | "image/png";
  lat: number | null;
  lng: number | null;
  accuracyM: number | null;
  source: "EXIF" | "DEVICE" | "UNAVAILABLE";   // A4
  capturedAt: string;          // ISO
}

export interface ParticipationCounts {
  youth: number;               // A1: under 30, any gender
  women: number;               // A1: female, 30+
  others: number;              // A1: remainder
}                              // total is derived, never stored

export interface ApprovalEvent {
  at: string;
  actorAccountId: string;
  actorDisplayName: string;
  actorRole: PortalRole;
  action: "SUBMITTED" | "APPROVED" | "RETURNED" | "RESUBMITTED";
  remarks?: string;            // required on RETURNED (A7)
}

export interface MassPledgeSubmission {
  id: string;
  reporterKind: ReporterKind;
  eventDate: "2026-08-18";     // A10, locked
  submittedAt: string;

  state?: string; district?: string; block?: string;   // ADMIN_TIER
  coordinatingMinistry?: string;                       // A2: attribution only
  entityName?: string;                                 // Forms 2–5
  entityIsOther?: boolean;

  counts: ParticipationCounts;
  photos: GeoPhoto[];                                  // 1–4, A5
  reportingOfficerName: string;
  reportingOfficerDesignation: string;
  contactNo: string;
  contactVerified: boolean;                            // A9
  declarationAccepted: true;

  status: SubmissionStatus;
  verification: VerificationTag;                       // A8
  locationUnavailable: boolean;                        // A4
  history: ApprovalEvent[];                            // A7
  createdBy: string;
}
```

### Photo pipeline (the constraint that shapes the build)

Four photos at 10MB each is 40MB raw, roughly 53MB as base64, against a browser localStorage quota of about 5MB. Storing originals is impossible in this architecture. On add:

1. Validate MIME (JPEG/PNG) and size (≤10MB, A5). Reject with a specific message naming the actual size.
2. Read EXIF GPS. If absent, request `navigator.geolocation` once per form session (A4).
3. Downscale to 1600px longest edge, JPEG q0.72 → `viewDataUrl`, typically 200–400KB.
4. Produce a 320px `thumbDataUrl` for tables and the counter.
5. Keep the original as an in-session blob URL for full-resolution preview before submit only.
6. Guard the quota: if the write would exceed a 4MB budget, fail with an actionable message rather than a `QuotaExceededError`.

Net: about 1.2MB per submission persisted. Documented in code as the reason originals are not retained.

### Role extension

`PortalRole` gains `"BLOCK"`. This touches:

| File | Change |
|---|---|
| `lib/nmba/committee/types.ts:57` | Add `"BLOCK"`; add `block?: string` to `PortalSession` |
| `lib/nmba/committee/session.ts:11` | Add to `ROLES`; validate `state`+`district`+`block` present for BLOCK |
| `lib/nmba/committee/session.ts:63` | `roleLabel` → "Block Nodal Officer" |
| `lib/nmba/committee/scope.ts:19` | `isVisible` BLOCK branch: own block only |
| `lib/nmba/committee/scope.ts:40` | `tiersForRole` → `["BLOCK"]` for BLOCK |
| `lib/nmba/committee/masters.ts:37` | Add BLOCK + the four non-tier demo accounts |

Regression risk: NAPDDR reads these helpers. Every existing NAPDDR behaviour for ADMIN/STATE/DISTRICT must be unchanged. Covered by acceptance criteria 21–22.

### Approval chain (A6, A7)

Entry tier determines the path, independent of coordinating ministry:

```
BLOCK    submits → PENDING_DISTRICT → PENDING_STATE → APPROVED
DISTRICT submits → PENDING_STATE                    → APPROVED
STATE    submits → APPROVED
Forms 2–5 submit → APPROVED, tagged SELF_DECLARED    (A8)
```

Return sends status to `RETURNED` with mandatory remarks, editable by the original submitter, resubmitting at the same tier. Every transition appends to `history`.

### Public counter (D2)

`/portals/nmba/mass-pledge` shows **approved figures only**, with an explicit "Verified through approval chain" note and a last-updated timestamp. Self-declared figures are shown as a separate, labelled line, never merged into the headline. A prominent "Provisional, prototype data" band renders while `NODE_ENV !== "production"`. No participant personal data appears; photos shown are thumbnails without geo-coordinates.

---

## Acceptance Criteria

**Form**
1. All five identity headers render correctly for their role; a BLOCK login sees State/District/Block read-only and prefilled from session.
2. `Total` is computed, read-only, and equals youth+women+others on every keystroke.
3. Each count field rejects negatives and non-integers, and shows its A1 definition as helper text.
4. Submit is blocked with under 1 or over 4 photos.
5. A photo over 10MB is rejected with a message naming its actual size.
6. A non-JPEG/PNG file is rejected by MIME, not extension.
7. A photo with EXIF GPS records `source: "EXIF"` and the correct coordinates.
8. A photo without EXIF, with permission granted, records `source: "DEVICE"`.
9. With geolocation denied, submission still completes, sets `locationUnavailable: true`, and the approver sees a warning badge.
10. Event date renders `18-08-2026`, is read-only, and cannot be altered via DOM manipulation of the input.
11. Outside 18–25 Aug 2026 the form is replaced by a closed-state message; the dev override toggles all three states.
12. Submit is blocked until the declaration checkbox is ticked.
13. Contact number requires 10 digits and a verified OTP before submit.
14. A duplicate submission by the same entity for 18-08-2026 is refused with a link to the existing one.

**Approval**
15. A BLOCK submission appears in the District approver's inbox and nowhere else.
16. District approval moves it to the State inbox, not straight to approved.
17. Return requires non-empty remarks; empty remarks blocks the action.
18. A returned submission is editable by its submitter, shows the remarks, and resubmits to the same tier.
19. `ApprovalTimeline` shows every transition with actor, role, timestamp and remarks.
20. A State officer cannot see or act on another state's submissions.

**Regression**
21. All existing NAPDDR flows behave identically for ADMIN, STATE and DISTRICT.
22. The individual e-Pledge pages and their totals are untouched and never sum with mass-pledge figures.

**Dashboard and counter**
23. National total equals the sum of approved submissions across all tiers and forms.
24. Pending submissions are excluded from totals and shown separately as "Pending".
25. Verified and self-declared figures are always visually distinct (A8).
26. Ministry attribution view shows Form 1 events grouped by coordinating ministry without adding them to that ministry's own total (A2).
27. The public counter shows approved figures only and carries the provisional band outside production.

**Standards**
28. Zero hardcoded colours, spacing or font-family in new files; tokens only.
29. Every new shared component is exported from `packages/design-system/index.ts` before use.
30. Keyboard-only completion of the entire form and approval flow, with visible focus throughout.
31. Axe reports no serious or critical violations on all seven routes.
32. All interactive controls reach 4.5:1 contrast in both `blue-light` and `blue-dark`.
33. `npm run lint` and `npm run typecheck` pass clean; no `any`.
34. Assumptions page lists A1–A11, each linked from the field it governs.

---

## Testing Plan

| Layer | What | Count |
|---|---|---|
| Unit | `computeTotal`, `resolveStatusOnSubmit`, `canApprove`, `isWithinWindow`, `downscaleImage`, `extractExifGps`, `isVisible` BLOCK branch | +18 |
| Integration | Block→District→State happy path; return-and-resubmit; duplicate refusal; quota guard; each of 5 identity headers | +12 |
| E2E | Block officer logs in, submits with 2 photos, District returns, Block corrects, State approves, figure appears on counter | +2 |
| A11y | Axe on all 7 routes, both colour modes | +14 |
| Regression | NAPDDR unchanged for 3 roles; e-Pledge untouched | +4 |

---

## Effort

| Component | CC | Human equivalent |
|---|---|---|
| DS: GeoPhotoInput, ApprovalTimeline, DeclarationCheckbox | ~45 min | 1.5 days |
| Block role extension + scope + demo accounts | ~20 min | 0.5 day |
| Block master seed (~300, every state/UT) | ~15 min | 0.5 day |
| Form + 5 identity headers | ~40 min | 1.5 days |
| Store, approval engine, audit trail | ~35 min | 1 day |
| Approvals inbox + detail | ~25 min | 0.5 day |
| Dashboard + public counter | ~30 min | 1 day |
| Assumptions page + field popovers | ~15 min | 0.5 day |
| Tests + a11y pass | ~40 min | 1.5 days |
| **Total** | **~4.5 hrs** | **~8.5 days** |

---

## Rollback

Additive. The module is new routes plus new files under `lib/nmba/mass-pledge/`. Reverting the commit removes it cleanly. The one shared edit is `PortalRole` gaining `"BLOCK"`, which is backwards-compatible: existing cookies decode unchanged, and NAPDDR's switch statements get an added branch, never a changed one. Seeded localStorage is namespaced `nmba_mass_pledge_v1` and cleared by the existing "Reset demo data" control.

---

## Out of Scope

- Real backend, database, file storage, production auth (D1: prototype)
- Full ~7,000-block LGD import (D3: representative subset; the swap is mechanical)
- Bulk credential provisioning and distribution to block officers (operational, not code)
- Hindi and regional-language translation (GIGW obligation, tracked separately across the estate)
- Any change to the individual e-Pledge module
- SMS/email notification on approval transitions
- Export to PDF or Excel

---

## Related

- `.claude/rules/portal-login-demos.md` — new demo accounts must be added there
- `.claude/rules/portal-appswitcher.md` — routes inherit the shell, no action needed
- `docs/superpowers/specs/2026-07-14-nmba-homepage-features-design.md`
