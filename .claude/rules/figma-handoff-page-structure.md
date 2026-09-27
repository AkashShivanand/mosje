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
| Reviewers, stakeholders, clients | `START HERE` → Portal Map; every journey in it links to its screens |
| Developers | the journey name on the ticket; the journey's rows hold every state and the phone version |
| Designers | the role columns in `B`, and the rows inside each flow |

## 2. Four areas, named in plain words

| Area | Name on canvas | Holds |
|---|---|---|
| A | `START HERE` | one group, `Guide to This Page`: `Guide — Cover`, `Guide — Portal Map`, `Guide — How to Read This Page`, `Guide — Status and Change Log` |
| B | `SCREENS BY WHO USES THEM` | every screen: user group → journey → version → rows |
| C | `SHARED PARTS` | page frame, access denied and page not found, error messages, reusable form content, reference images |
| D | `OLD SCREENS — DO NOT USE` | replaced screens (dated, faded) and leftover pieces awaiting a person's sweep |

The letters A–D are only how this rule and the check refer to the areas; they are not on the canvas.

## 3. Inside "Screens by Who Uses Them"

```
SCREENS BY WHO USES THEM                               area
└─ NGO — Applying for a Grant                          user group (a column)
   └─ SHRESHTA Mode 2 Application Form                 journey
      └─ New Application — 7 Steps                     version — only where the journey splits
         ├─ Desktop                                    row
         ├─ Mobile                                     row — each phone screen under its desktop screen
         └─ Pop-ups and Dialogs                        row
            NGO / SHRESHTA Mode 2 New Application / Step 3 of 7 — Institution Details
```

- **User groups** are columns, left → right in the order an application meets them. First is always
  `Everyone — Signing In`. A group with more than **nine journeys** is split by phase
  (`NGO — Applying for a Grant`, `NGO — After Applying`). Columns grow **down**; new groups push the page **right**.
- **Journeys** run top → bottom in the order they happen; one another depends on comes first.
- **Versions** only where a journey genuinely splits (New Application / 1st Instalment Claim …;
  Programme Division / Integrated Finance Division).
- **Rows** always: `Desktop`, `Tablet` (if drawn), `Mobile`, `Pop-ups and Dialogs`. A phone screen sits at the
  **same x** as its desktop screen, matched by name minus ` — Mobile`; an undrawn phone screen leaves a gap.
- **Nothing is ever loose.** Every screen is in a row, every row in a journey.
- **Never move, archive or delete someone's screens to make the page agree with the build.** When the build
  has moved on, the screens stay where they are and the difference is written on the Status page; a person
  decides whether they are replaced. (17 Sep 2026: an NGO sign-in flow was archived this way and had to be restored.)

## 3a. A hand-off frame shows the PRODUCT, never the prototype's scaffolding
(standing instruction, 24 Sep 2026)

**Only what would ship goes into a hand-off frame.** The demo dock and its flask button, the
brand switcher, the account picker and any other prototype rail are how a reviewer drives the
prototype; they are not part of the service, and a screen pushed with one on it tells a
developer to build it.

So a capture taken for Figma hides them first:

```js
// before the screenshot
document.head.insertAdjacentHTML("beforeend",
  "<style>.ds-demo-fab, .ds-demodock, [class*=demodock], [class*=demo-fab]{display:none!important}</style>");
```

What stays is everything a citizen or an officer would actually see, including the statutory
accessibility control — that ships.

## 4. Names — plain words, no codes (decided 17 Sep 2026)

Every name is read by reviewers who were not in the room, so every name is plain English in Title Case,
with no codes, IDs, pixel widths or developer words (`Auth`, `Shared`, `Wizard Body`, `Populated`, `Default`).

| Level | Grammar | Example |
|---|---|---|
| Area | fixed, §2 | `SHARED PARTS` |
| User group | `<Who> — <Doing What>` | `Officers — Reviewing Applications` |
| Journey | what the person is doing | `Changing Answers After Submitting` |
| Version | `<Version> — N Steps` | `1st Instalment Claim — 7 Steps` |
| Row | fixed, §3 | `Pop-ups and Dialogs` |
| Screen | `<Who> / <Which Screen> / <What Is Showing>`; phone ends ` — Mobile`; dialogs end `(Dialog)` | `NGO / My Applications / No Matching Applications` |
| Helper | `Guide — `, `Note — `, `Reference — `, `Leftover — ` | `Note — Needs Discussion` |

"Who" is `Everyone`, `NGO`, `Officer`, `Programme Director` or `PMU Field Officer`. A state that is the only
one a screen has is left off (`NGO / Notifications`). Journey names are unique on the page; a ticket cites the
journey name, so renaming a journey is announced in the Change Log.

## 5. State order — left to right, by what the section varies on

| Varies on | Order |
|---|---|
| Form steps | nothing chosen → Step 1 → … → last step → success; a step's error or filled-in variant sits right after that step |
| Data surface | Populated → Partial → Filtered → Filtered to Nothing → Empty → Loading → Error → Too Much |
| Form | Empty → Filled → Validation Error → Submitting → Success |
| Record lifecycle | the lifecycle, e.g. Submitted → Action Required → Sanctioned → Released |
| Officer grade | ASO → SO → US → DS → JS |
| Component | Default → Hover → Focus → Pressed → Selected → Disabled → Error |

## 7. Colour

**Grey by depth — deeper is darker.** Never white (white is what a screen is), never a hue per role.

| Depth | Grey | Pending (red) |
|---|---|---|
| 0 | `#EAEAEA` — product wrapper, multi-portal pages only | — |
| 1 | `#E3E3E3` area | — |
| 2 | `#DCDCDC` user group / group | `#ECD2D2` |
| 3 | `#D5D5D5` journey | `#E5CBCB` |
| 4 | `#CECECE` version or row | `#DEC4C4` |
| 5 | `#C7C7C7` row | `#D7BDBD` |
| 6 | `#C0C0C0` clamp | `#D0B6B6` |

**Red = Needs Discussion — only where a decision could change the screens** (decided 17 Sep 2026). Most
open questions (a label's meaning, a deadline, whether a count is typed) do not change a screen's design;
those are listed in plain words on the Status page and are **not** red. A journey that is red:

1. ends its name with ` — Needs Discussion` (the layers panel shows no colour, so the name carries it);
2. is filled on the red ramp above, and so is everything inside it;
3. carries a `Note — Needs Discussion` at its top: each open point in plain words, what is **drawn for now**,
   and that it is confirmed with the Ministry and the vendor before building. No question codes. Text and
   borders bound to SAMAVESH (`text/status/error/bolder`, `border/status/error/base`, `text/neutral/bolder`,
   `text/neutral/subtle`);
4. is listed under "Needs Discussion — Screens May Change" on the Status page and shown red on the Portal Map.

When decided: remove the suffix and the note, re-run the layout (the red goes), log it.

**Old screens:** frames in `OLD SCREENS — DO NOT USE` sit at **40% opacity** so nobody measures from a replaced screen.

## 8. Start Here

Four frames, 3840 wide, Noto Sans, colours bound to SAMAVESH, **generated from the canvas, never typed**:

1. **Guide — Cover** — portal name, one-line purpose, screens, user groups, journeys, how many need discussion.
2. **Guide — Portal Map** — one column per user group, one box per journey, each box a link to its screens,
   red boxes for journeys that need discussion, and one line on how an application moves.
3. **Guide — How to Read This Page** — the four areas, what is inside a column, screen names, colours, finding your way.
4. **Guide — Status and Change Log** — Needs Discussion (linked), other questions for the Ministry in plain words,
   open items, dated log.

Regenerate them whenever a journey is added, renamed or decided.

## 9. Spacing, placement, layers

| | px |
|---|---|
| between screens in a row | 96 |
| between rows | 120 |
| between journeys / versions | 240 |
| between user-group columns | 800 |
| between areas | 1600 |
| section padding top · sides | depth ≤2: 240 · 160 — depth 3: 160 · 80 — deeper: 120 · 80 |

A at (0, 0). B below A. C to the right of B, D to the right of C, top-aligned with B. Every section
hugs its content. **The layers panel reads in reading order** — Figma lists the last child first, so
children are re-inserted in reverse.

## 10. The gate

`npm run check:figma-handoff` reads every page in `tools/figma-handoff-structure/pages.json` over
REST (never the MCP seat quota) in two layers:

- **identity** — area names, Start Here present, journeys named in plain words and unique, rows named,
  screens named, phone frames aligned, pending flows carry a note, nothing loose at the root;
- **visual** — fills on the ramp (grey or pending red), overlaps, layer order, canvas order, ≤ 9 journeys
  per column, old-screen opacity.

Both are **ratcheted** against `baseline.json`: a page may not gain violations; a page that improves
must be re-baselined (`--update-baseline`) in the same change. `--strict` demands zero.
`--selftest` plants nine known faults in a copy of the live tree and proves each is caught — run it
after changing the checker. Without `FIGMA_ACCESS_TOKEN` it prints SKIPPED; that is not a pass.

**Register a page in `pages.json` the day it is created**, conformant or not.

## 11. Done means

- [ ] `npm run check:figma-handoff -- --portal <Portal> --strict` passes; `--selftest` passes
- [ ] Every screen accounted for: count before = count after (plus `Guide —` / `Note —` frames)
- [ ] Every name reads as plain English — no codes, IDs, pixel widths or developer words
- [ ] Red only where a decision could change the screens; each traces to a documented open question
- [ ] Portal Map and Status regenerated from the canvas
- [ ] Before/after pictures captured from the same REST renders
- [ ] Snapshot recorded in `tools/figma-handoff-structure/manifests/<portal>.json`
- [ ] **In Figma, by a person** (no API): name a version in version history. Flows are not
      marked Ready for dev — not used on this estate (17 Sep 2026)
- [ ] **With people:** one developer and one reviewer who have not seen the page each find a named
      screen from the Portal Map, and it takes under a minute
