---
paths:
  - "docs/design-handoffs/**"
  - "tools/figma-handoff-structure/**"
  - ".claude/skills/figma-page-organiser/**"
---

# One shape for every portal handoff page (MANDATORY)

**Every portal page in a handoff file — `MoSJE Portal [Handoff]` (`gH2vQ62cfg4677YKWuOpLc`),
the E-Anudaan file (`evmNmlK8g4VYwJVu2FwSGV`), and any file that follows — is organised the
same way.** A designer, an engineer or a reviewer who has learned one portal page has
learned them all.

It exists because the E-Anudaan page reached 201 frames in fifteen sections and could
not be navigated by anyone who had not drawn it. Measured on 17 Sep 2026:

| Defect | What the reader met |
|---|---|
| Layers panel order `1, 14, 2, 11, 12, 13, 15, 9, 10, 5, 3, 4, 6, 7, 8` | the outline — the one navigator every audience uses — in no order at all |
| Sections 2, 3, 4.1–4.7, 14 on `#FFFFFF`; 1.1–1.3 on `#EAEAEA` inside `#E3E3E3` | a child lighter than its parent, so containment read backwards |
| Numbers that are positions | inserting one section renumbers every later one, and every doc that cited "section 6" is wrong |
| Mobile frames interleaved in the desktop row | a 17,000px row where the fourth frame is a phone and the fifth is desktop again |
| No cover, no map, no legend | an external reviewer's first view is 163,000px of grey strip at 1% zoom |

Procedure (how to apply this to a page): the `figma-page-organiser` skill.
Worked example: `docs/design-handoffs/E-Anudaan-Handoff-Page-Plan.md`.
Gate: `npm run check:figma-handoff` (§9).

---

## 1. Audience is served by ZONES and ENTRY POINTS — never by copies

Three audiences read the page: designers (patterns, states), engineers (build order,
one screen at a time) and stakeholders (whole journeys). **Never give each audience its
own copy of a screen.** Frames are not components; three copies of `Review / Default`
drift within a week, and the one a developer builds from is the stale one.

Instead the page is four zones, each led by the audience that seeks it first, and each
audience gets a front door that is not the raw canvas:

| Zone | Name | Holds | Led by | Their front door |
|---|---|---|---|---|
| **A** | `A · START HERE` | cover, portal map, legend, status & change log | stakeholders, newcomers | the canvas itself — top-left, first in the layers panel |
| **B** | `B · JOURNEYS` | every screen, by user role → flow → state | designers + engineers | engineers: **Dev Mode's Ready-for-dev list** (flow sections, ID-sorted). Stakeholders: **prototype flow starting points**, one per happy path |
| **C** | `C · BUILD REFERENCE` | the shell, system status screens, local components, anything no single journey owns | engineers, then designers | links from the flows that use them |
| **D** | `D · ARCHIVE` | superseded frames (dated), stray nodes awaiting sweep | nobody daily | — |

**A zone letter is permanent.** A portal that needs a fifth zone appends `E`; it never
re-letters.

## 2. Inside B: role lanes, then flows, then states

```
B · JOURNEYS                                        depth 1  #E3E3E3
└─ B2 · Applicant (NGO) · Apply for a Grant         depth 2  #DCDCDC   ← role lane
   └─ B2.30 · SHRESHTA Mode 2 Application           depth 3  #D5D5D5   ← flow (Ready for dev unit)
      └─ New Application · 7 Steps                  depth 4  #CECECE   ← branch (only if the flow forks)
         ├─ Desktop · 1440                          depth 5  #C7C7C7   ← row
         ├─ Mobile · 375                            depth 5
         └─ Dialogs & Overlays                      depth 5
            └─ NGO / SHRESHTA Mode 2 · New / Step 3 of 7 — Institution Details   ← frame
```

### Lanes (depth 2) — one per USER ROLE, in order of first touch in the case lifecycle

- `B1` is always **`Everyone · Access & Identity`** — sign-in, registration, recovery.
  It is every role's entry point, so it leads.
- Then the roles in the order a case meets them: the applicant, the processing chain,
  the sanctioning authority, the field/inspection role, then oversight roles.
- **A lane holds at most nine flows.** The tenth forces a split of that role by phase
  (`B2 · Applicant (NGO) · Apply for a Grant`, `B3 · Applicant (NGO) · After Submission`).
  Nine is the most a reader scans without losing their place, and the split keeps a
  lane column from outgrowing the canvas.
- Lanes are **columns**, left → right, top-aligned. A lane grows DOWN as flows are added;
  the zone grows RIGHT as roles are added.

### Flows (depth 3) — in the order they are built upon

Within a lane, a flow that another flow depends on comes first: a dashboard before the
forms launched from it, the pattern-setting form before its derivatives, the upload step
before the tracking screens that display its results. Where two flows are independent,
follow the portal's own sidebar order.

**A flow section is the unit of handoff.** Mark it Ready for dev; never mark a lane or a
zone. That makes Dev Mode's list a flat, ID-sorted list of buildable flows.

### Branches (depth 4) — only where a flow genuinely forks

New application / 1st instalment / 2nd instalment; Programme Division / Finance Division.
A flow that does not fork has no branch level — do not add one for symmetry.

### Rows (depth 5, or 4 when there is no branch) — device down, state across

| Row | Holds | Alignment |
|---|---|---|
| `Desktop · 1440` | every state of the screen, in the §3 order | the reference row |
| `Tablet · 768` | only when drawn | each frame directly below its desktop counterpart — **same x** |
| `Mobile · 375` | only when drawn | same x as its desktop counterpart; an undrawn phone frame leaves its slot EMPTY, so coverage gaps are visible at a glance |
| `Dialogs & Overlays` | modals, sheets, menus, confirmations | below the screen that opens them |

A flow with only one row type still gets its row section — a flow that later gains a
phone column must not be re-laid out.

## 3. State order — pick the axis the section actually varies on

| Section varies on | x-axis order |
|---|---|
| **Wizard steps** | pre-step states (nothing chosen) → Step 1 → … → Step N → Success. A step's validation error sits in the same row directly after that step |
| **Data surface** (list, register, table, dashboard) | Populated → Partial → Filtered → Filtered to Nothing → Empty → Loading → Error → Too Much (the seven states of `data-state-completeness.md`, canonical first) |
| **Form** | Empty → Filled → Validation Error → Submitting → Success |
| **Record lifecycle** | the lifecycle: Submitted → Action Required → Sanctioned → Released |
| **Seat / grade** | the hierarchy: ASO → SO → US → DS → JS |
| **Interactive component** | Default → Hover → Focus → Pressed → Selected → Disabled → Error |

When two axes vary at once (seat × lifecycle), the axis with more values runs across and
the other becomes branches.

## 4. Names

| Level | Grammar | Example |
|---|---|---|
| Zone | `<Letter> · <NAME IN CAPS>` | `B · JOURNEYS` |
| Lane | `<Letter><n> · <Role> · <Phase>` (phase only when split) | `B4 · Officer · Process Applications` |
| Flow | `<Letter><n>.<nn> · <Flow Name>` | `B2.30 · SHRESHTA Mode 2 Application` |
| Branch | `<Variant> · <N> Steps` or `<Variant>` | `1st Instalment · 7 Steps` |
| Row | `Desktop · 1440` · `Tablet · 768` · `Mobile · 375` · `Dialogs & Overlays` | |
| Frame | `<Role> / <Screen> / <State>[ · Mobile]` | `Officer / My Queue / Programme Division — Section Officer · Mobile` |
| Helper | `.` prefix | `.doc / Portal Map`, `.helper / Dropdown Menu` |

**IDs are stable, not positional.** Flows are numbered in tens (`.10`, `.20` …); a flow
inserted between `.30` and `.40` takes `.35`. **Order still equals ID** — the layout
script sorts by it — but inserting a flow renames nothing else, so a ticket, a PR or a
doc that cites `B2.30` stays right. Retiring a flow retires its number; it is not reused.

Section names are Title Case (`ui-restraint-and-copy.md`); frame role prefixes match the
portal's route groups so an engineer can map a frame to code (`NGO /` ↔ `(ngo)`,
`Officer /` ↔ `(console)`).

## 5. Colour — depth, never meaning

Fills are assigned **by nesting depth**, and only from this ramp:

| Depth | Fill | Level |
|---|---|---|
| 0 | `#EAEAEA` | product wrapper — **multi-portal pages only**; a single-portal page starts at 1 |
| 1 | `#E3E3E3` | zone |
| 2 | `#DCDCDC` | lane (in A, C, D: the group) |
| 3 | `#D5D5D5` | flow |
| 4 | `#CECECE` | branch, or row where there is no branch |
| 5 | `#C7C7C7` | row |
| 6 | `#C0C0C0` | clamp — reaching it is a signal the flow wants splitting, not nesting |

- **Deeper is darker, always.** A child is never lighter than its parent, and no section
  is white — white is what a screen is, and a white section makes its screens vanish.
- **No hue per role.** Hue on the canvas is reserved for the screens; a blue lane would
  compete with gov-blue in every frame on it. Role identity is carried by the lane name
  and by the Portal Map.
- **The one exception is D.** Frames in `D · ARCHIVE` are set to **40% opacity** so no one
  measures from a superseded screen by mistake. Clarity outranks a uniform system here.
- The Portal Map in A draws each lane with the lane's own grey, so the map doubles as the
  colour legend.

## 6. Zone A — what it must contain

Four frames, each **3840 × 2160** (so it presents cleanly in Present mode and reads at
~10% zoom), headings 96px+, text bound to SAMAVESH styles:

1. **`.doc / Cover`** — portal name, one-line purpose, build status, last reconciled date,
   owners, links to the route root, Storybook and the handoff doc.
2. **`.doc / Portal Map`** — lanes as columns in their greys, flows as labelled boxes
   carrying their IDs and **hyperlinked to their sections**; entry points marked; a
   dependency arrow wherever a flow is only reachable after another role acts
   (e.g. an instalment application after a sanction).
3. **`.doc / How to Read This Page`** — the zone/lane/flow/row grammar, the ramp, the state
   orders that page uses, and the Dev Mode + prototype entry points.
4. **`.doc / Status & Change Log`** — dated entries; open items (undrawn devices,
   inferred states, pending sweeps) with owners. Forward-looking, not archaeology.

## 7. Spacing — 8px grid, sized for zoom

| Gap / padding | px | Why |
|---|---|---|
| frame gutter (x) | 96 | frame name labels do not collide |
| row-section gap (y) | 120 | |
| flow gap within a lane (y) | 240 | |
| lane gap (x) | 800 | lanes read as columns at 2–5% |
| zone gap | 1600 | zones read as blocks at zoom-to-fit |
| section padding, top | depth 1–2: 240 · depth 3: 160 · depth 4+: 120 | the section title label keeps a constant screen size as you zoom out, so it needs more room than the content does |
| section padding, sides and bottom | depth 1–2: 160 · depth 3+: 80 | |

Every section hugs its content, deepest first. Siblings never overlap.

**Canvas arrangement:** A at the top-left (0, 0), running right. B below A, lanes as
columns. C to the right of B's last lane, D to the right of C, all top-aligned with B.
Growth is always right (new roles, new zones) or down (new flows, new devices) — never up
or left, so nothing already placed has to move away from its bookmarks.

## 8. The layers panel is the navigator — its order is the reading order

Figma lists the LAST child first. So after layout, children are re-inserted in reverse
reading order: the panel reads `A, B, C, D` top-down, lanes `B1 → Bn`, flows by ID,
rows `Desktop, Tablet, Mobile, Dialogs`, frames left to right. A canvas that is tidy and
an outline that is scrambled is still an unnavigable page — that was E-Anudaan.

## 9. The gate

`npm run check:figma-handoff` reads every page registered in
`tools/figma-handoff-structure/pages.json` over REST (not the MCP seat quota) and reports:
loose frames at the page root, zone/lane/flow names off-grammar, fills off the ramp or
lighter than a parent, white sections, sibling overlaps, layer order ≠ ID order, empty
sections, frames without `Role / Screen`. `--strict` exits non-zero; a page is
**conformant** when strict passes.

**Add a portal page to `pages.json` the day its handoff page is created**, even if it
fails — an unregistered page is a page nobody is measuring.

## Checklist before a handoff page is shared

- [ ] Four zones A–D; A top-left and first in the layers panel
- [ ] No copies of a screen made for an audience
- [ ] Lanes are user roles, `B1` is Access & Identity, ≤ 9 flows per lane
- [ ] Every flow has a stable tens-ID; order equals ID
- [ ] Rows: device down, state across, phones under their desktop counterpart
- [ ] State order follows §3 for what the section varies on
- [ ] Fills by depth from the ramp; no white section; archive frames at 40%
- [ ] Zone A carries Cover, Portal Map (hyperlinked), Legend, Status & Change Log
- [ ] Flow sections (only) marked Ready for dev; one prototype starting point per happy path
- [ ] Layers panel order equals reading order
- [ ] `npm run check:figma-handoff -- --strict` passes for the page
