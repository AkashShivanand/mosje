# NHAPOA — Live Capture Coverage Ledger

**Verified:** 2026-07-04 · source: live `-dev` deployments · engine: `tools/design-audit/engine` (Playwright, keep-alive login per role) · manifest: `captures/_captured.json`

This is the authoritative answer to "is every screen / state / flow captured?". It is split into
**base screens** (auto-captured this run) and **interactive states** (assisted captures) so the gaps
are explicit.

## 1. Base screens — 59 / 59 captured (all 8 roles) ✅

Auto-discovered from each role's nav after login, full-page screenshot + computed-CSS + real text.

| Role | Screens | Routes |
|------|--------:|--------|
| Citizen (public) | 5 | `/`, `/register-grievance`, `/register-rescue`, `/track-status`, `/help-faqs` |
| District Officer | 7 | dashboard, cases, clarifications, investigation, reports, sla, notifications |
| SHO | 7 | reuses the District-Officer shell (lands on `/district-officer/dashboard` — confirmed live) |
| State Authority | 8 | dashboard, all-cases, pending-approvals, approved-cases, sent-back, reports, sla, notifications |
| Finance Officer | 5 | dashboard, queue, transactions, utilisation, notifications |
| Central Authority | 7 | dashboard, grievances, state-comparison, scheme-performance, fund-allocation, reports, notifications |
| System Admin | 12 | dashboard, grievances, sla-monitor, officer-performance, analytics, geographic, reports, users, roles, categories, **portal-feedback**, notifications |
| Call-Center | 8 | dashboard, caller, register-grievance, query, queries, directory, track, faq |

**Routes discovered beyond the original inventory:** `/admin/portal-feedback`, and the whole Call-Center
route set (`/call-center/caller|query|queries|directory|track|faq`) that was previously un-inventoried.

## 2. Interactive states — substantial, with named gaps ⚠️

Auto-capture gets base routes only. These states come from assisted captures (`captures/citizen/`,
`captures/details/`). What exists:

**Citizen — full flows captured** (`captures/citizen/`, 46 imgs)
- Register Grievance 5-step wizard: step1 default/filled → step2 informer → step3 victim → step4 grievance-details → step5 review → confirm-modal → success ✅
- Register Rescue: default → filled → OTP → verified → success ✅
- Track Status: default → ref-filled → result ✅

**Admin details/modals captured** (`captures/details/`, 11 imgs)
- District Officer: detail overview / investigation / clarification / documents / audit-log, clarification modal, document drawer ✅
- Finance Officer: sanction-review detail, "why on hold" modal ✅
- System Admin: grievance detail, create-user modal ✅

### Remaining state gaps (need assisted capture to reach 100%)
- **State Authority:** approve / reject / send-back modals; case detail
- **Finance Officer:** disbursement modal + success
- **System Admin:** edit-user, role-editor, add/edit-category modals (only create-user done)
- **Central Authority:** fund-allocation modal; grievance detail
- **Call-Center:** register-grievance flow states (filled/OTP/success); query flow
- **All admin lists:** empty / error / filtered variants
- **Auth (all roles):** `/login`, `/forgot-password`, OTP (in `skipRoutes`, never captured)

## 3. Data fidelity — real content is extractable ✅

Every base-screen capture stored `rows[]` with real `text` + computed CSS (fontFamily, size, color,
padding). Confirmed real content is present, e.g. System-Admin nav labels ("Grievance Monitoring",
"SLA Monitor", "Officer Performance", "Grievance Analytics", "Geographic View", "Reports & Export",
"User Management", "Role Management", "Grievance Categories", "Feedbacks", "Notifications") and page
copy. This is the source for seeding the build's mock store verbatim (no placeholder).

**Note:** live nav labels differ from NHA-1's provisional labels (e.g. "Grievance Monitoring" vs
"Grievance Monitoring"; "Geographic View" vs "Geographic"; "Feedbacks" is a screen NHA-1 lacks). The
build (NHA-2…NHA-8) must adopt the captured labels/routes as the source of truth and add `portal-feedback`.

## 4. Assets

- Base-screen data + PNGs: `captures/_captured.json` (59) + `captures/_dev1_live/*.json` + `captures/live/*.png`
- State/flow PNGs: `captures/citizen/**` (46) + `captures/details/*.png` (11)
- Total PNGs on disk: 304
