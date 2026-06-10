# eUtthan Admin — Design Suggestions (for Figma / design team)

> **Separate from the dev report.** These are *design-side* items: improvements to existing Figma
> frames, IA/consistency notes, program-level token decisions, and DS-based proposals for screens
> that exist live but were never designed. Each item is written so it can be actioned directly in Figma.
> Dev-fixable fidelity defects live in the annotated PDF report + the tracker, not here.

Status legend: 🟦 Proposed · 🟨 In design · ✅ Done in Figma · ⬜ Rejected

---

## A. Program-level decisions

### DS-PRG-001 · Brand-primary token conflict 🟦
- **Observed:** DS library + live portal use **`#003366`** (navy) as brand primary; `CLAUDE.md` documents `gov-blue #0373DF`.
- **Impact:** Conflicts on every primary surface across all portals until resolved.
- **Recommendation:** Adopt **`#003366`** as the single canonical `Primary/Source` (matches DS + Handoff + live), and update `CLAUDE.md` + `@mosje/tokens`. If `#0373DF` is intended, reverse — but pick one.

### DS-PRG-002 · Neutral grey ramp is missing from the DS 🟦
- **Observed:** The DS library defines only **`Neutral/Source #374151`** + white. The live build needs greys for body text, muted text, borders and surfaces, so devs reached for Tailwind greys (`#4b5563`, `#6b7280`, `#9ca3af`, `#1f2937`, border `#e2e8f0`, surface `#f8fafc`) — heavily used on every screen.
- **Why this is a DS issue, not a dev defect:** you can't fault the build for greys the DS never tokenised.
- **Recommendation:** Add a tokenised neutral ramp (e.g. Neutral 50→900) to the DS and Figma variables; then dev can map to it.

### DS-PRG-003 · Missing brand tokens: gov-yellow + active-nav surface 🟦
- **Observed:** `#FFD323` (gov-yellow, used for the BETA badge) and `#E5EFF9` (sidebar active-nav surface, used consistently across all screens) are not in the DS library.
- **Recommendation:** Add `Accent/Gov-Yellow #FFD323` and a `Surface/Nav-Active #E5EFF9` (or derive from Primary/100) token so these consistent usages are governed.

### DS-PRG-004 · Define a radius scale 🟦
- **Observed:** The DS defines a single radius (`button-corner 8`). The build uses `4/6/12/14px` across components.
- **Recommendation:** Publish an explicit radius scale (e.g. xs 4 / sm 8 / md 12) so component corners are intentional and consistent.

---

## B. Existing-frame design fixes

### DS-ADMIN-001 · Header title: "Ministry" vs "Department" 🟦
- **Frame:** Admin/Dashboard `4226-39685` (and every frame carrying the masthead).
- **Observed:** Figma reads **"Department of Social Justice & Empowerment"**; live reads **"Ministry of Social Justice & Empowerment"** — live appears correct.
- **Recommendation:** Update the masthead text in the design to the correct entity name (confirm with stakeholders), so design and build agree.

### DS-ADMIN-002 · Sidebar IA mismatch (design = generic MoSJE template) 🟦
- **Observed:** Design frames show a multi-scheme MoSJE nav (Transgender, NMBA, NOS, …); the live eUtthan portal has a portal-specific nav (Manage Financial Year/Ministry/Scheme/Outcome/Documents, Map, User & Role Management, PFMS Logs, Reports).
- **Recommendation:** Update the Figma navigation to the actual eUtthan IA so the design system reflects the shipped product (or confirm the generic nav is intentional shell scaffolding).

---

## C. No-design screens — DS-based proposals (built, never designed)
> Captured during the audit; designs to be created in Figma using the DS components + the visual
> language of the existing eUtthan frames (navy `#003366`, Noto Sans, 8px radius, DS Card/Table/Button).

| ID | Screen | Live URL | Status |
|----|--------|----------|--------|
| DS-ADMIN-010 | Login | https://eutthan-admin-uat.mosje.in/login | 🟦 to propose |
| DS-ADMIN-011 | Role Management | https://eutthan-admin-uat.mosje.in/role-management | 🟦 to propose |
| DS-ADMIN-012 | PFMS Logs | https://eutthan-admin-uat.mosje.in/pfms-logs | 🟦 to propose |
| DS-ADMIN-013 | Reports / Financial Summary | https://eutthan-admin-uat.mosje.in/reports/financial-summary | 🟦 to propose |
| DS-ADMIN-014 | Reports / Statement 10A | https://eutthan-admin-uat.mosje.in/reports/statement-10a | 🟦 to propose |

_Proposals (layout, components, states) are appended below as each screen is captured during the audit pass._
