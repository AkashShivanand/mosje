# E-Anudaan Handoff Page — Reorganisation Plan

**File** `evmNmlK8g4VYwJVu2FwSGV` · **Page** `E-Anudaan` (`51313:165608`) · **Drafted** 17 Sep 2026
**Standard** `.claude/rules/figma-handoff-page-structure.md` · **Procedure** `figma-page-organiser` skill
**Gate** `npm run check:figma-handoff -- --portal E-Anudaan --strict`

This is the first page moved onto the estate-wide handoff structure, and the worked example
every other portal page copies. Nothing here redraws a screen: it re-parents, renames,
re-orders and re-colours the 263 nodes that exist (201 of them the screens verified against the build on 16 Sep), and adds four documentation frames.

---

## 1. What is wrong today (measured, not remembered)

Read over REST on 17 Sep 2026; the gate reports **169 violations**.

| Symptom | Count | Who it hurts |
|---|---|---|
| Layers panel out of reading order (`1, 14, 2, 11, 12, 13, 15, 9, 10, 5, 3, 4, 6, 7, 8`) | 61 | everyone — the outline is how all three audiences navigate |
| White sections (2, 3, 4.1–4.7, 14, 14.1–14.3, 1.4, Z) | 15 | designers — screens vanish into their container |
| Children lighter than parents (1.1–1.3 on `#EAEAEA` inside `#E3E3E3`) | 3 | everyone — containment reads inside-out |
| Position numbers (`1 · …` to `15 · …`) | 67 | engineers — "section 6" in a ticket goes stale on the next insert |
| No Start Here, no map, no legend | — | stakeholders — first view is a 17,000 × 163,000px strip |
| Mobile frames interleaved in desktop rows | 32 | engineers — the responsive pair of a screen is not beside it |
| Dialogs in a separate section from their trigger screen (10.2) | 8 | engineers — the review screen and its dialogs are 9,000px apart |
| Superseded and stray nodes on the working canvas | 21 | anyone who measures from a retired frame |

## 2. The decisions, and why they would survive review

**Audience is not a folder.** The brief asks to group by role first. Read literally —
a designer area, a developer area, a stakeholder area — that means three copies of every
screen, and frames are not components: copies drift, and the developer builds from the
stale one. So audience is served by **zones** (what kind of material) and **front doors**
(how each audience arrives), and **role** in the grouping hierarchy means the portal's own
**user roles** — the axis all three audiences share. A stakeholder says "the officer's
review", a developer's route group is `(console)`, a designer's pattern is "the seat-varying
worklist"; all three point at the same lane.

| Audience | Seeks first | Front door |
|---|---|---|
| Stakeholders, clients | "what does an NGO go through?" | `A · START HERE` → Portal Map; **prototype flows** in Present mode — they never pan the canvas |
| Engineers | "the flow on my ticket, and its states" | **Dev Mode Ready-for-dev list** — flat, ID-sorted flow sections; `C · BUILD REFERENCE` for the shell |
| Designers | "every state of this pattern, and what is missing" | lanes in `B`; the Mobile row's empty slots show the undrawn phone column at a glance |

**Lanes are columns, not a strip.** The page today is 10:1 tall. Seven role lanes side by
side, each growing down, bring it to roughly 1:1 — zoom-to-fit shows every lane name.

**Stable tens-IDs, not positions.** Flows are `B2.30`, `B2.40`; a new scheme between them
becomes `B2.35`. The delivery-status doc cites sections by number — that citation should
survive the next insert.

**Instalments stay with their scheme.** A 1st-instalment application is only reachable after
a sanction, which argues for filing it under "after sanction". It is not filed there because
it is the same wizard, built from the same step bodies, and a developer builds the four
variants together. The dependency is drawn on the Portal Map instead.

**Officer review keeps its dialogs.** `10.2 · Dialogs and Menus` is dissolved into the
`Dialogs & Overlays` row of the review flow, each dialog below the seat that opens it.

**The archive is dimmed.** Superseded frames drop to 40% opacity — the one departure from a
purely depth-based palette, because nobody should be able to measure from them by accident.

## 3. The target tree

Depth fills: zone `#E3E3E3` · lane `#DCDCDC` · flow `#D5D5D5` · branch `#CECECE` · row
`#C7C7C7` (`#CECECE` where a flow has no branch). Old section numbers in brackets.

```
A · START HERE
├─ A1 · Cover                                   .doc / Cover                       NEW
├─ A2 · Portal Map                              .doc / Portal Map                  NEW
├─ A3 · How to Read This Page                   .doc / How to Read This Page       NEW
└─ A4 · Status & Change Log                     .doc / Status & Change Log         NEW

B · JOURNEYS
├─ B1 · Everyone · Access & Identity                                         ← entry point, all roles
│  ├─ B1.10 · Sign In — NGO, Credentials                 [1.1]  Empty → Filled
│  ├─ B1.20 · Sign In — NGO, DARPAN ID                   [1.2]  Empty → Filled
│  ├─ B1.30 · Sign In — Officer                          [1.3]  Empty → Filled
│  └─ B1.40 · Password Recovery                          [1.4]  Forgot → Reset  (today Reset precedes Forgot)
│
├─ B2 · Applicant (NGO) · Apply for a Grant
│  ├─ B2.10 · Dashboard & Notifications                  [2]
│  ├─ B2.20 · Choose a Scheme                            [3]
│  ├─ B2.30 · SHRESHTA Mode 2 Application                [4.1–4.4]  ← pattern-setter: the only scheme live on dev
│  │   └─ New · 7 Steps │ 1st Instalment · 7 Steps │ 2nd Instalment · 4 Steps │ 3rd Instalment · 4 Steps
│  ├─ B2.40 · SMILE (Garima Greh) Application            [4.5–4.7]  ← same 7-step body as SHRESHTA
│  │   └─ New │ 1st Instalment │ 2nd Instalment
│  ├─ B2.50 · AVYAY Application                          [5.1–5.4]
│  │   └─ New · 8 Steps │ 1st Instalment · 7 Steps │ 2nd · 4 │ 3rd · 4
│  ├─ B2.60 · NAPDDR Application                         [5.5–5.8]  ← forks: renewal adds CCTV, EAT & PFMS step
│  │   └─ New · 10 Steps │ 1st Instalment · 11 Steps │ 2nd · 4 │ 3rd · 4
│  └─ B2.70 · Upload Documents                           [6.1, 6.2]  row lifecycle: Not Uploaded → Uploading →
│                                                                   Upload Failed → Refused → … → Verified
│
├─ B3 · Applicant (NGO) · After Submission
│  ├─ B3.10 · My Applications                            [7.1]  Populated → Filtered → Filtered to Nothing
│  ├─ B3.20 · Application Detail                         [7.2]  Submitted → Action Required → Sanctioned → Released
│  ├─ B3.30 · Deficiencies & Correction                  [7.3]
│  ├─ B3.40 · Utilisation Certificate & Inspection       [8.1]
│  ├─ B3.50 · Project Location & Bank Accounts           [8.2]
│  ├─ B3.60 · Beneficiaries & Staff                      [8.3]
│  ├─ B3.70 · Attendance                                 [8.4]
│  └─ B3.80 · CCTV Setup                                 [8.5]
│
├─ B4 · Officer · Process Applications
│  ├─ B4.10 · My Queue                                   [9.1, 9.2]  branches: Programme Division │ Finance Division
│  │                                                                 across: ASO → SO → US → DS → JS
│  ├─ B4.20 · Review an Application                      [10.1, 10.2] across: ASO → … → JS, then mid-review states
│  │                                                                 Dialogs & Overlays row: [10.2] under their seat
│  ├─ B4.30 · All Applications                           [9.3]  Default → Filtered to Sanctioned → Filtered to Rejected
│  ├─ B4.40 · Registers                                  [9.4]  Sanctioned → Returned → Rejected → Forwarded
│  ├─ B4.50 · Queries                                    [9.5]  Programme Division → Finance Division
│  └─ B4.60 · Notifications                              [11.5]
│
├─ B5 · Officer · Oversight & Records
│  ├─ B5.10 · NGO Directory & NGO 360                    [11.1]
│  ├─ B5.20 · Bank Account Changes                       [11.4]
│  ├─ B5.30 · Payment Status                             [11.6]
│  ├─ B5.40 · Reports & Analytics                        [11.2]
│  └─ B5.50 · Audit Trail                                [11.3]  Populated → Filtered
│
├─ B6 · Programme Director · Sanction
│  ├─ B6.10 · Sanction Desk                              [13.1]
│  ├─ B6.20 · Examine and Sanction                       [13.2]  Default; Dialogs row: Sanction → Return → Reject confirmation
│  └─ B6.30 · Sent & Inspection Reports                  [13.3]
│
└─ B7 · PMU Field Officer · Inspect
   ├─ B7.10 · Inspection Dashboard                       [12.1]
   ├─ B7.20 · Inspections                                [12.2]
   └─ B7.30 · Registers — Institutions, Location Changes [12.3]

C · BUILD REFERENCE
├─ C1 · Portal Shell                                     [14.1]
├─ C2 · System Status — 403, 404                          [14.2]
└─ C3 · Wizard Step Bodies — SHRESHTA & SMILE             [14.3]  local components; linked from B2.30, B2.40

D · ARCHIVE — NOT FOR BUILD                                       frames at 40% opacity
├─ D1 · Superseded — 17 Sep 2026                          [15]
└─ D2 · Stray Nodes — Sweep Before Handoff                [Z]    ⚠ needs a human decision to delete
```

**Why B4 and B5 split the officer role.** Eleven officer flows exceed the nine-per-lane cap.
The split is by what the officer is doing — moving a case vs. looking something up — which is
also how the sidebar reads for a JS, whose extra items are Audit Trail and Reports.

**Why the Director precedes PMU.** Lanes follow the case: applied → processed → sanctioned →
inspected. PMU inspections are only reachable for a sanctioned project.

## 4. Canvas geometry

```
(0,0) ┌───────────── A · START HERE ─────────────┐
      │ Cover │ Portal Map │ How to Read │ Log   │   4 × 3840×2160
      └──────────────────────────────────────────┘
        ↓ 1600
      ┌──────────────────────────────── B · JOURNEYS ─────────────────────────────────┐ 1600 ┌── C ──┐ 1600 ┌── D ──┐
      │ B1 │800│ B2 (widest: NAPDDR 1st Inst. 11 steps) │800│ B3 │800│ B4 │800│ B5 │ B6 │ B7 │      │       │      │ 40%   │
      │    │   │  ↓ flows stack down                    │   │    │   │    │   │    │    │    │      │       │      │       │
      └────────────────────────────────────────────────────────────────────────────────┘      └───────┘      └───────┘
```

Estimated extent ≈ 85,000 × 90,000px (today 17,600 × 163,000). Growth: new flows extend a
lane down; the phone column extends every flow down by one row; a new role inserts a lane and
pushes C and D right.

The ≈ figures are estimates from today's section sizes; the layout script reports the real extent.

## 5. Zone A content

| Frame | Carries |
|---|---|
| `.doc / Cover` | E-Anudaan · "Online grant-in-aid applications from NGOs to the Department, and their processing." · live on dev: SHRESHTA Mode 2 · last reconciled 16 Sep 2026 (197 of 201 identical to build) · route root `/portals/e-anudaan` · links to this doc and `docs/plans/2026-09-16-e-anudaan-delivery-status.md` |
| `.doc / Portal Map` | 7 lane columns in `#DCDCDC`, flow boxes in `#D5D5D5` with IDs, each hyperlinked to its section. Entry points: B1.10–B1.30. Dependency arrows: B2.30–B2.60 → B4.20 → B6.20 (sanction) → B2 instalment branches, B3.40, B7.20 |
| `.doc / How to Read This Page` | the grammar, the ramp, the three state orders this page uses (wizard, data surface, seat), the Dev Mode + prototype entry points |
| `.doc / Status & Change Log` | Open: phone column deferred for 68 frames (16 Sep, user decision); D2 sweep pending; 3 frames differ from build only by drawing a dialog open. Log: this reorganisation |

**Prototype starting points** (stakeholder happy paths): `B1.10 Sign In → B2.10 → B2.20 → B2.30
New Step 1…7`; `B4.20 Review — ASO`; `B6.20 Examine and Sanction`; `B3.20 Application Detail
Submitted → Released`.

## 6. Execution — budgeted for the MCP seat

The seat stalls after ~20–25 `use_figma` calls (`figma-call-budget.md`). The whole move is
re-parenting and renaming, which is cheap per node, so it is planned in **eight writes and
three screenshots**. Writes are atomic; a failure costs its call and changes nothing.

| # | Call | Does |
|---|---|---|
| 0 | REST (free) | `npm run check:figma-handoff -- --portal E-Anudaan --verbose > before.txt`; render the page's current sections to PNG for the before picture |
| 1 | write | create `A · START HERE`, `B · JOURNEYS`, `C`, `D` zones and all lane sections (empty) |
| 2 | write | re-parent + rename B1, B2 flows; split 4.x/5.x into branches under their flow |
| 3 | write | re-parent + rename B3, B4 (dissolve 10.2 into Dialogs rows), B5 |
| 4 | write | re-parent + rename B6, B7, C, D; archive opacity 40% |
| 5 | write | create row sections; move `· Mobile` frames under their desktop counterpart's x |
| 6 | write | recursive layout: fills by depth, order by ID / state order, spacing §7, hug, layer re-insert |
| 7 | write | build the four `.doc` frames bound to SAMAVESH styles; hyperlinks to flow node ids |
| 8 | write | Ready-for-dev on flow sections; prototype starting points |
| 9–11 | screenshot | page overview; B2 at 10%; A2 Portal Map at 25% |
| — | REST | gate `--strict` must pass; re-render for the after picture |

Every emptied old section is deleted only after a read confirms it has zero children
(as the P6 pass did for the pre-rebuild containers). **D2's stray nodes are not deleted by
the script** — a human confirms.

## 7. Done means

- [ ] `npm run check:figma-handoff -- --portal E-Anudaan --strict` exits 0
- [ ] Node count still 263 (+4 `.doc` frames); frames renamed only where §4 of the rule requires
- [ ] Before/after pair captured and attached to the PR
- [ ] Delivery-status doc's section references updated to the new IDs
- [ ] `docs/design-handoffs/` index line added; this plan's checklist ticked
