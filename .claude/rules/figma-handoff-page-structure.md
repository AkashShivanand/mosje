---
paths:
  - "docs/design-handoffs/**"
  - "tools/figma-handoff-structure/**"
  - ".claude/skills/figma-page-organiser/**"
---

# One shape for every portal handoff page (MANDATORY)

**Every portal page in a handoff file — `MoSJE Portal [Handoff]` (`gH2vQ62cfg4677YKWuOpLc`),
the E-Anudaan file (`evmNmlK8g4VYwJVu2FwSGV`), and any file that follows — is organised the
same way, so a person who has learned one portal page has learned them all.**

It exists because the E-Anudaan page reached 263 frames in fifteen sections and could not be
navigated by anyone who had not drawn it: the layers panel read `1, 14, 2, 11, 12, 13, 15, 9 …`,
fifteen sections were white, phone frames sat inside desktop rows, section numbers were
positions, and there was no cover, map or legend. It was reorganised to this rule on
17 Sep 2026 and is the worked example: `docs/design-handoffs/E-Anudaan-Handoff-Page.md`.

Procedure: the `figma-page-organiser` skill. Layout code: `tools/figma-handoff-structure/layout-engine.js`.
Gate: `npm run check:figma-handoff` (§10).

---

## 1. Top level: grouped by USER ROLE; audiences get ways in, never copies

"Role" means **the portal's user roles** — NGO applicant, officer, director, field officer — the
one axis designers, developers and reviewers all talk about the same way. (Decided 17 Sep 2026.)

**Never make a copy of a screen for an audience.** Frames are not components; copies drift and a
developer builds from the stale one. Each audience gets a way in instead:

| Audience | Way in |
|---|---|
| Reviewers, stakeholders, clients | `A · START HERE` → Portal Map; every flow in it links to its screens |
| Developers | the flow ID on the ticket; the flow's rows hold every state and the phone version |
| Designers | the role columns in `B`, and the rows inside each flow |

## 2. Four zones

| Zone | Name on canvas | Holds |
|---|---|---|
| **A** | `A · START HERE` | one group, `Guide to This Page`, with four frames: Cover, Portal Map, How to Read This Page, Status & Change Log |
| **B** | `B · SCREENS BY USER ROLE` | every screen: role column → flow → branch → rows |
| **C** | `C · SHARED BUILDING BLOCKS` | portal shell, system status and service-error screens, reusable step bodies, reference assets |
| **D** | `D · ARCHIVE — DO NOT BUILD FROM` | superseded screens (dated), stray nodes awaiting a person's sweep |

A zone letter is permanent. A fifth zone appends `E`.

## 3. Inside B

```
B · SCREENS BY USER ROLE                               depth 1  zone
└─ NGO Applicant · Apply for a Grant                   depth 2  role column
   └─ NGO 30 · SHRESHTA Mode 2 Application             depth 3  flow — the unit of handoff
      └─ New Application · 7 Steps                     depth 4  branch — only where the flow splits
         ├─ Desktop · 1440                             row
         ├─ Mobile · 375                               row — each phone frame under its desktop frame
         └─ Dialogs & Overlays                         row
            NGO / SHRESHTA Mode 2 · New / Step 3 of 7 — Institution Details
```

- **Role columns** run left → right in the order a case meets them. First is always
  `Everyone · Sign In & Account` — everyone's entry point. A role with more than **nine flows** is
  split by phase (`NGO Applicant · Apply for a Grant`, `NGO Applicant · After Submission`).
  Columns grow **down**; new roles push the page **right**.
- **Flows** run top → bottom by ID. A flow another depends on comes first (dashboard before forms,
  the pattern-setting form before its variants, upload before tracking).
- **Branches** only where a flow genuinely forks (New / 1st / 2nd / 3rd Instalment; Programme /
  Finance Division). No branch level for symmetry.
- **Rows** always, even when a flow has one: `Desktop · 1440`, `Tablet · 768` (if drawn),
  `Mobile · 375`, `Dialogs & Overlays`. A phone frame sits at the **same x** as its desktop frame,
  matched by name minus ` · Mobile`; an undrawn phone screen leaves its slot empty.
- Nothing is ever loose: every screen is in a row, every row in a flow.

## 4. Flow IDs — fixed, scoped to the role, never positional

`<ROLE> <number> · <Flow Name>` — `ACCESS 10 · Sign In — NGO, Credentials`, `NGO 135 · Which
Answers Can Change`, `OFFICER 160 · Project Records & CCTV Compliance`.

- The **role code** is plain English (`ACCESS`, `NGO`, `OFFICER`, `DIRECTOR`, `PMU`), so the ID is
  readable without a legend.
- Numbers go in tens. A new flow takes a free number between (`NGO 135`). **Nothing is ever
  renumbered**, so a ticket, PR or document that cites an ID stays right.
- IDs belong to the **role, not the column**: splitting or regrouping columns renames no flow.
  (The first draft of this rule numbered by column — `B4.20` — and the pressure test showed a
  column split would renumber every later flow.)
- A retired ID is not reused. IDs are unique across the page.

## 5. State order — left to right, by what the section varies on

| Varies on | Order |
|---|---|
| Wizard steps | nothing chosen → Step 1 → … → last step → success |
| Data surface | Populated → Partial → Filtered → Filtered to Nothing → Empty → Loading → Error → Too Much |
| Form | Empty → Filled → Validation Error → Submitting → Success |
| Record lifecycle | the lifecycle, e.g. Submitted → Action Required → Sanctioned → Released |
| Officer grade | ASO → SO → US → DS → JS |
| Component | Default → Hover → Focus → Pressed → Selected → Disabled → Error |

## 6. Names

| Level | Grammar | Example |
|---|---|---|
| Zone | `<Letter> · <NAME IN CAPS>` | `C · SHARED BUILDING BLOCKS` |
| Role column | `<Role> · <Phase>` | `Officer · Process Applications` |
| Flow | §4 | `DIRECTOR 20 · Examine and Sanction` |
| Branch | `<Variant>[ · N Steps]` | `1st Instalment · 7 Steps` |
| Row | fixed names, §3 | `Mobile · 375` |
| Screen | `<Role> / <Screen> / <State>[ · Mobile]` | `NGO / My Applications / Filtered` |
| Helper | `.` prefix | `.doc / Portal Map`, `.note / Pending Discussion`, `.stray / Table / Cell` |

Title Case throughout. Screen role prefixes match the code's route groups (`NGO /` ↔ `(ngo)`,
`Officer /` ↔ `(console)`).

## 7. Colour

**Grey by depth — deeper is darker.** Never white (white is what a screen is), never a hue per role.

| Depth | Grey | Pending (red) |
|---|---|---|
| 0 | `#EAEAEA` — product wrapper, multi-portal pages only | — |
| 1 | `#E3E3E3` zone | — |
| 2 | `#DCDCDC` role column / group | `#ECD2D2` |
| 3 | `#D5D5D5` flow | `#E5CBCB` |
| 4 | `#CECECE` branch or row | `#DEC4C4` |
| 5 | `#C7C7C7` row | `#D7BDBD` |
| 6 | `#C0C0C0` clamp | `#D0B6B6` |

**Red = Pending Discussion** (standing instruction, 17 Sep 2026). A flow or group that has been
designed to the recommended approach while a decision is still open with the Ministry or the
vendor:

1. takes ` · Pending Discussion` at the end of its name — the layers panel shows no colour, so the
   name carries it too;
2. is filled on the red ramp above, and so is everything inside it (same lightness step per depth,
   so containment still reads);
3. carries a **`.note / Pending Discussion`** frame at its top: each open question with its reference
   (e.g. `Q-4`), what is drawn **for now**, and that it is confirmed with the Ministry and the vendor
   before build. Text and borders bound to SAMAVESH (`text/status/error/bolder`,
   `border/status/error/base`, `text/neutral/bolder`, `text/neutral/subtle`);
4. is listed on the Status & Change Log and shown red on the Portal Map.

**Only a documented open question makes a flow pending** — the portal's questions list (for E-Anudaan,
`docs/plans/2026-09-16-e-anudaan-delivery-status.md` §4) or a recorded design decision awaiting
sign-off. When it is decided: remove the suffix, the note and the red, update the Change Log.

**Archive:** frames in `D` sit at **40% opacity** so nobody measures from a retired screen.

## 8. Zone A

Four frames, 3840 wide, Noto Sans, colours bound to SAMAVESH:

1. **Cover** — portal name, one-line purpose, screen count, roles, pending count, last build check,
   where the build and the notes are.
2. **Portal Map** — **generated from the canvas, not typed**: one column per role, one box per flow
   with its ID, each box a link to its section, pending flows red, and one line on how a case moves.
3. **How to Read This Page** — zones, role → flow → branch → rows, IDs, names, colours, ways in.
4. **Status & Change Log** — pending list (linked), open items with who acts, dated log.

Regenerate the Portal Map and the pending list whenever a flow is added, renamed or decided.

## 9. Spacing, placement, layers

| | px |
|---|---|
| between screens in a row | 96 |
| between rows | 120 |
| between flows / branches | 240 |
| between role columns | 800 |
| between zones | 1600 |
| section padding top · sides | depth ≤2: 240 · 160 — depth 3: 160 · 80 — deeper: 120 · 80 |

A at (0, 0). B below A. C to the right of B, D to the right of C, top-aligned with B. Every section
hugs its content. **The layers panel reads in reading order** — Figma lists the last child first, so
children are re-inserted in reverse.

## 10. The gate

`npm run check:figma-handoff` reads every page in `tools/figma-handoff-structure/pages.json` over
REST (never the MCP seat quota) in two layers:

- **identity** — zone names, Start Here present, flow IDs well-formed and unique, rows named,
  screens named, phone frames aligned, pending flows carry a note, nothing loose at the root;
- **visual** — fills on the ramp (grey or pending red), overlaps, layer order, canvas order, ≤ 9 flows
  per role column, archive opacity.

Both are **ratcheted** against `baseline.json`: a page may not gain violations; a page that improves
must be re-baselined (`--update-baseline`) in the same change. `--strict` demands zero.
`--selftest` plants eight known faults in a copy of the live tree and proves each is caught — run it
after changing the checker. Without `FIGMA_ACCESS_TOKEN` it prints SKIPPED; that is not a pass.

**Register a page in `pages.json` the day it is created**, conformant or not.

## 11. Done means

- [ ] `npm run check:figma-handoff -- --portal <Portal> --strict` passes; `--selftest` passes
- [ ] Every screen accounted for: count before = count after (plus `.doc` / `.note` frames)
- [ ] Pending flows are red, suffixed, noted, and each traces to a documented open question
- [ ] Portal Map and Status regenerated from the canvas
- [ ] Before/after pictures captured from the same REST renders
- [ ] Snapshot recorded in `tools/figma-handoff-structure/manifests/<portal>.json`
- [ ] **In Figma, by a person** (no API): name a version in version history. Flows are not
      marked Ready for dev — not used on this estate (17 Sep 2026)
- [ ] **With people:** one developer and one reviewer who have not seen the page each find a named
      screen from its ID, and it takes under a minute
