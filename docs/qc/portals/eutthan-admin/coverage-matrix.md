# eUtthan Admin — Figma ↔ Live Coverage Matrix

Live: `https://eutthan-admin-uat.mosje.in` · Design: Handoff `gH2vQ62cfg4677YKWuOpLc`.
Status legend: ✅ audited · ⏳ pending · 🆕 no design (→ Design Proposal) · 🔒 not yet captured.

## Admin role (live nav confirmed)
| Live route | Figma frame | Coverage | QC |
|------------|-------------|----------|----|
| `/login` | — | 🆕 no design | Login screen never designed → propose |
| `/dashboard` | `4226:39685` Admin/Dashboard | ✅ designed+built | **Audited (calibration)** |
| `/admin/financial-year-management` | `4226:40009` Financial Year (+ Add `4226:43777`, Edit `4226:44550`) | designed+built | ⏳ |
| `/ministry-management` | `4226:40288` Manage Ministry (+ Add `4226:43881`) | designed+built | ⏳ |
| `/scheme-management` | `4226:40449` Manage Scheme (+ scrolled `4226:43077`, Add `4226:43990`) | designed+built | ⏳ |
| `/manage-outcome` | `4226:40657` Manage Outcome (+ scrolled `4226:43305`, Add `4226:44105`) | designed+built | ⏳ |
| `/document-management` | `4226:42902` Documents (+ Add `4226:44221`/`44329`) | designed+built | ⏳ |
| `/map-ministry` | `4226:41073` Map Ministry/Schemes (+ 7 map/mapped/unmap states) | designed+built | ⏳ |
| `/user-management` | `4226:40865` Manage User (+ list `4226:43533`, Add `4226:44437`) | designed+built | ⏳ |
| `/role-management` | — | 🆕 no design | → Design Proposal |
| `/pfms-logs` | — | 🆕 no design | → Design Proposal |
| `/reports/financial-summary` | — | 🆕 no design | → Design Proposal |
| `/reports/statement-10a` | — | 🆕 no design | → Design Proposal |

## Ministry role (creds: shivendra123) — 🔒 not yet captured
13 Figma frames exist (`figma-inventory.md`): Dashboard, Manage Scheme, Physical Progress Data
(+Add/Import-Excel), Manage Outcome (+Add). Capture after Admin pass.

## Summary
- **Designed + built (fidelity audit):** 8 Admin base screens (+ ~19 state variants) + 13 Ministry screens.
- **No design (design-proposal candidates):** Login, Role Management, PFMS Logs, Reports ×2 — confirms
  "only key screens were designed."
- **Designed, not built / extra:** none confirmed yet (verify during pass).
