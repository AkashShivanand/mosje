# SMILE-Admin — Design-QC Audit Spec & Kickoff Prompt

> Target: **https://smile-admin-dev.mosje.in** (SMILE — Support for Marginalized Individuals for
> Livelihood & Enterprise; admin/back-office portal). Method: the repo's **`/design-qc`** skill driving
> the **`tools/design-audit/`** engine. This document is the brief a future session reads to run the audit
> end-to-end. It does **not** run anything itself.

---

## 0. Kickoff prompt (paste this to launch the audit)

> Run a full design-QC + functional audit of the **SMILE-admin** portal on the shared engine.
>
> - **Live build:** https://smile-admin-dev.mosje.in — login at `/login` (mobile number + password).
> - **Figma design:** `<PASTE THE SMILE-ADMIN FIGMA FILE/FRAME LINK — REQUIRED, not yet provided>`.
> - **Logins (dev; test accounts — put in gitignored `secrets.json`, never commit):**
>   - Super Admin — `9000000900` / `Password@123`
>   - Central Authority — `9000000901` / `Password@123`
>   - US / SO — `<CONFIRM number — the brief says 9000000900, which duplicates Super Admin>` / `Password@123`
>   - NISD — `9000000907` / `Password@123`
>   - State / District officers — **none given; create test users** via Super Admin → Users → Onboard.
>
> Onboard the project (`bootstrap.py`), do Phase 0 (Figma MCP dump with a `heading` per frame), run
> `engine/run.py --phase all`, then build the curated human report. Ship only when the three gates are
> green (coverage ledger, crosscheck, `failures.md`). Follow `references/audit-rules.md` and fold back
> every correction.

**Before pasting, resolve the two ⚠ items in §1.** The audit cannot start without the Figma link.

---

## 1. Inputs — collect these first (2 are missing/ambiguous)

| Input | Value | Status |
|---|---|---|
| Live URL | `https://smile-admin-dev.mosje.in` | ✅ given |
| Login route | `/login` — **mobile number + password** (not email/OTP) | ✅ confirmed by app source |
| **Figma design link(s)** | — | ⚠ **MISSING — REQUIRED.** `/design-qc` compares the build against a Figma design; with no design link there is no "intent" to diff against. Ask for the SMILE-admin Figma file (and the key frame/node ids, or at least the file so Phase 0 can enumerate frames). |
| Super Admin | `9000000900` / `Password@123` | ✅ |
| Central Authority | `9000000901` / `Password@123` | ✅ |
| US / SO | `9000000900` / `Password@123` | ⚠ **duplicates Super Admin** — almost certainly a typo. Confirm the real US/SO mobile before capture, or this role silently captures the Super Admin session and MISMAPs. |
| NISD | `9000000907` / `Password@123` | ✅ |
| State / District officers | create-your-own | ✅ note: onboard test users via Super Admin (§4) |
| Output dirs | engine: `tools/design-audit/projects/smile-admin/` · deliverables: `docs/qc/portals/smile-admin/` | ✅ convention |

**Credentials handling:** test accounts on the user's own **dev** environment, supplied for this audit.
They go into the gitignored `projects/smile-admin/secrets.json` (bootstrap writes it; verify
`git check-ignore` first) and are used only by the engine's Playwright login. Never commit them, never
print them in the report, never fire a real OTP/SMS.

---

## 2. Scope & roles

**In scope:** every navigable screen for each role, its entry/auth states, and reachable
detail/modal/create states (captured non-destructively). Visual fidelity **and** the functional half
(broken links/nav, forms & interactions, WCAG 2.1 AA / GIGW).

**Roles to capture** (each lands on its own scoped dashboard; capture role-by-role in **one keep-alive
session per role** — SMILE-admin logins likely share an IP rate-limiter, so a burst can lock a role):

| Role | Mobile | Scope / expected surface |
|---|---|---|
| Super Admin | 9000000900 | Everything — users, roles, permissions, master-settings, all modules, audit-log |
| Central Authority | 9000000901 | National oversight — approvals, fund-monitoring, MIS reports |
| US / SO | ⚠ confirm | Under Secretary / State Officer tier — state-scoped review/approvals |
| NISD | 9000000907 | National Institute of Social Defence — training/rehab modules, its releases |
| State Nodal Officer | create | State-scoped survey/persons/shelter-home/fund views |
| District Nodal Officer | create | District-scoped subset |

**Out of scope / route-to-suggestions:** copy/label/column-name wording (data-driven), dynamic data
rows, build-only extras not in the design (→ Design-Suggestions doc, not findings), any destructive
commit (approve/reject/disburse/delete — capture the modal OPEN state and Cancel only).

---

## 3. Screen coverage (route surface)

The deployed sidebar is the source of truth (the engine's `discover_routes` reads sidebar hrefs per
role). For reference, the local build exposes these route groups — expect the live portal to mirror most:

- **Dashboard** · **notifications** (+ compose) · **audit-log** · **performance-stats**
- **Survey:** survey-list · surveys (+ create, `[id]`) · survey-locations (+ create) · surveyors ·
  surveyor-list · surveyor-mapped
- **Persons:** persons (+ `[id]`) · mobilized · under-mobilized · shelter-home
- **Shelter homes:** shelter-homes · beneficiaries · checklist
- **Rehab:** comprehensive-rehab (+ data, skill-training) · immediate-review · beggary-schemes (+ `[id]`)
- **Fund monitoring:** fund-monitoring · sanction-orders (+ create) · nisd-releases (+ create) ·
  nodal-officer-onward-releases (+ create)
- **MIS reports:** survey-location · rehabilitated · ia-agency-institute · beneficiary · mobilised ·
  shelter-home
- **Admin:** users (+ onboard) · roles (+ `[roleId]`, edit) · permissions · master-setting (+
  shelter-homes) · ia-list · ia-approvals · do-list
- **Auth:** login · forget-password · reset-password

**States needing interactive capture** (the declarative route-crawl can't reach these — write per-portal
capture drivers in `projects/smile-admin/`, mirroring TG's, and log the gap in the coverage ledger if any
can't be reached on dev):
- Create/onboard wizards (users/onboard, surveys/create, sanction-orders/create, survey-locations/create)
- Row → detail views (`persons/[id]`, `surveys/[id]`, `beggary-schemes/[id]`, `roles/[roleId]/edit`)
- Approve / reject / release modals (fund-monitoring, ia-approvals) — **OPEN state + Cancel only**
- Empty vs populated tables — if dev has no seeded data, audit structure + empty-states and DEFER
  data-gated detail/chip styling with a clear reason.

---

## 4. Engine setup (concrete)

Project does not exist yet → **bootstrap it** (writes config + gitignored secrets, auto-detects the login
form by visiting `/login`):

```bash
cd tools/design-audit
python3 -m playwright install chromium ; (cd engine && npm i)   # once
python3 engine/bootstrap.py --name smile-admin --portal "SMILE Admin" --idprefix SMA \
  --figma "<SMILE FIGMA URL>" --admin https://smile-admin-dev.mosje.in \
  --role "super-admin=9000000900:Password@123" \
  --role "central-authority=9000000901:Password@123" \
  --role "us-so=<CONFIRM>:Password@123" \
  --role "nisd=9000000907:Password@123"
```

**Phase 0 (agent, via Figma MCP)** — mandatory before `run.py`:
- `inputs/figma-frames.json` — **a `heading` per frame** (rendered H1/title, largest-font non-chrome text
  in the title band). This powers the coverage + MISMAP gate; without it the design↔build tier is off.
- `inputs/tokens.json` — from `get_variable_defs` on ≥2 representative frames (a light screen + a
  status/table-heavy dashboard); set `baseline.mode="derived"`. Do **not** hand-author tokens.
- `captures/figma/<SLUG>.png` — frame screenshots (2× for sharpness).

Then:
```bash
python3 engine/run.py --project smile-admin --phase all     # capture + analyze + report (MACHINE-DRAFT)
```

**Create the State/District test users** before capturing those roles: log in as Super Admin → Users →
Onboard → create one State officer + one District officer (note their mobiles in `secrets.json`), then
add `--role` entries and re-capture. Use throwaway test identities, not real people.

**SMILE-admin specifics:** it's a **Next.js 15 + Tailwind v3** portal on the shared DS — audit against the
`@mosje/design-system` visual language where a frame is undesigned; expect the shared masthead / gov-bar /
AppSwitcher, so consolidate those into **Global** findings (§5), not per-screen repeats.

---

## 5. Finding rules (from `references/audit-rules.md` — honor all)

- **Flag token-level style only:** font size/weight/**family**, colour, **background**, **border/radius**,
  **input & control states** (default/hover/focus/disabled), icon style. Audit these **visually** even
  when the DS isn't wired to the build.
- **Never flag:** width/height (responsive), copy/label/column wording (data-driven), hidden layers,
  build-only extras (→ Design-Suggestions). font-family mismatch = a **font-LOADING** finding.
- **Check the live state** before asserting a missing action (an approved/read-only row has no action
  button by design). A "missing/extra" element that is actually present is a **style** finding.
- **Severity** is a rubric function (GIGW/WCAG 2.1 AA), not a keyword guess. **Blocker** =
  ship-stopping/compliance (e.g. the GIGW-mandated masthead accessibility toolset removed). **Major** =
  visible break of intent/hierarchy or a real interaction/a11y defect (dead target <44px, font-loading
  fallback, chart overflow, neutral-token loss, KPI off the type scale). **Minor** = token/spacing/radius
  drift. **Nit** = optional. Order **severity-first, then top-to-bottom**.
- **Canonical 6 categories:** Layout & Spacing · Color & Token · Typography · Components & States ·
  Content & Iconography · Responsive & A11y.
- **Consolidate repeats into GLOBAL findings + a `Scope: Global` tag** (masthead/co-branding, sidebar,
  page header, data tables, pagination, status chips, chart palette, KPI scale, icon system,
  notifications). Each Global finding still needs a representative design frame + Figma-frame link.
- **Pins are never guessed** — derived from real element boxes, asserted ⊂ element ⊂ crop ⊂ image.

---

## 6. Gates — ship only when all three are green

1. **Coverage** (`out/coverage-ledger.json`) — no `UNMAPPED` design frame. `DESIGN-ONLY` (declared debt)
   = WARN; a genuinely missed screen = FAIL. Flag modal/sub-states that need interactive capture.
2. **Mapping** (`out/crosscheck.md`) — not `FAIL`. Requires the Phase-0 `heading` per frame. MISMAP =
   design and build titles disagree (wrong frame↔capture pairing).
3. **Pins** (`out/failures.md`) — empty (every pin asserted inside its element/crop/image).

Then verify the PDF is not silently stale: byte size changed + mtime fresh + rasterize a page.

---

## 7. Deliverables

1. **MACHINE-DRAFT** PDF/HTML from the engine (🤖/👤 stamped; cannot self-certify as WCAG/GIGW).
2. **Curated human report** — `projects/smile-admin/build_final_report.py` (+ `sync_data.py` once a
   reviewer sheet is synced) → polished PDF rendered into `docs/qc/portals/smile-admin/` via a **copy** of
   the canonical `generate_pdf.py` + `render.js` (copy, never fork) + a master Excel tracker (one row per
   finding, Scope column).
3. **Editable Figma review sheet** (3-column DESIGN | BUILD | ISSUES) the reviewer edits → "sync from
   Figma" folds edits back + regenerates + re-runs the mapping gate.
4. **(Optional) pinned Figma report** (draggable pins) reusing the file's kit.
5. **Design-Suggestions doc** for build-only extras / token decisions / undesigned screens.

---

## 8. Capture & safety discipline

- **Keep-alive per role** (SPAs keep tokens in `sessionStorage`, which Playwright's `storage_state`
  doesn't persist) — log in once per role, capture all its screens in the same session.
- **Shared-IP rate-limiter:** capture roles sequentially; if a role locks, wait a full quiet cooldown
  (each retry re-arms the timer) — park it in `deferred[]` and finish the others.
- **Never** fire a real OTP/SMS, commit a destructive action, or create real (non-test) records on dev.
  Capture destructive modals in their OPEN state and Cancel.
- **Verify tab/state captures by image hash** — a silent no-op click reuses the same hash (drop dups).
- Capture-time "unexpected error" toasts are session artifacts, not build defects — don't flag them.

---

## 9. Learning loop (mandatory)

Read `references/audit-rules.md` before starting; after the run, append every correction as a dated
`YYYY-MM-DD (smile-admin rN)` rule and **escalate any mechanizable mistake into an engine gate**. A
correction that can become an assertion **must**.
