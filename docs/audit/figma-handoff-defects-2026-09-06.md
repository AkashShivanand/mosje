# Figma handoff — structural defects, 6 September 2026

**File:** `MoSJE Portal — Handoff` (`evmNmlK8g4VYwJVu2FwSGV`)
**Page audited:** `E-Anudaan` (`51313:165608`) — 5,138 nodes, 44 screen artboards
**Read-only.** Nothing in the file was changed. This is the record of what the code
templates deliberately diverge from, per `.claude/rules/standards-precedence.md`.

---

## 1. What the page is

One portal, one journey — E-Anudaan grant-in-aid application intake, drawn three times
for three schemes.

| Section | Screens | Node |
|---|---:|---|
| `LOGIN & AUTHENTICATION` | 18 (9 desktop / 9 mobile) | — |
| `AVYAY - Atal Vayo Abhyuday Yojana` | 9 | — |
| `NAPDDR - National Action Plan for Drug Demand Reduction` | 5 | — |
| `SHRESHTA Mode 2 - Residential Education Support` | 10 | — |
| Orphans, in no section | 2 | `51326:6489`, `51643:14083` |

Archetypes present: auth 16 · wizard field-entry 15 · wizard document-upload 5 ·
chooser 3 · review 2 · side sheet 2 · dashboard 1.

**Archetypes absent entirely:** list/table with filters · search · settings · profile ·
notifications · empty state · error page · post-submit confirmation · any admin screen
beyond the admin login. `Pagination`, `Breadcrumb`, `Search` and any layer named "empty"
return **zero hits across all 5,138 nodes**.

---

## 2. Defects, most consequential first

### 2.1 One page type, ten content measures and five sidebars

| Sidebar width | Screens | Verdict |
|---:|---:|---|
| 300 | 13 | **decision** — expanded |
| 88 | 6 | **decision** — collapsed rail |
| 268 | 3 | drift (SHRESHTA) |
| 260 | 2 | drift (SHRESHTA) |
| 280 | 1 | drift (SHRESHTA) |

Inner measures in use: **1352 · 1140 · 1132 · 1124 · 1108 · 1096 · 1092 · 1076 · 1068 ·
800.** Gutters in use: **0 · 24 · 32 · 170.**

Correct set: **1140 at sidebar 300, 1352 at sidebar 88.** Two measures, two gutters.

### 2.2 The same screen drawn three ways under one name

Three frames named `e-anudaan-select-scheme`:

| | AVYAY `51326:6806` | NAPDDR `51582:109622` | SHRESHTA `51488:40094` |
|---|---|---|---|
| masthead | `Navbar/Portal` **146** | `navbar` 134 | `navbar` 134 |
| column x / w | 300 / 1140 | 300 / 1140 | **324 / 1116** |
| measure | 800 centred, 170 gutter | 800 | **1068 full-bleed** |
| options | `radio-card` ×4 (instances) | `radio-card` ×4 | **4 hand-built frames, no component** |
| CTA width | 223 | 223 | **105** |
| descendants | 31 | 31 | **53** |

AVYAY's is also the **only screen on the page using the 146px `Navbar/Portal`** — the
other 25 use `navbar` at 134.

### 2.3 Seven frames are drawn shorter than their own content

A reviewer scrolling the page sees a truncated screen and cannot know it.

| Frame | Artboard | Overflow | Cause |
|---|---:|---:|---|
| `step-3-bank-beneficiaries-filled` | 1024 | **+840** | `FormContent` is 1730 tall — **~60% of the screen is not visible** |
| `step-3-bank-beneficiaries-empty` | 1024 | **+490** | `FormContent` 1380 |
| `step-1-org-details-filled` | 1120 | **+370** | `action-footer` starts at y=1450 |
| `Portal Switch` (mobile) | 812 | +365 | `Auth / PortalList` 1032 |
| `Portal Switch` (desktop) | 960 | +129 | `Auth / PortalList` 1008 |
| `step-2-institution-details-filled` | 1200 | +43 | `content-area` 1109 |
| `step-1-org-details-empty` | 1120 | +42 | `action-footer` at y=1122 |

All seven are SHRESHTA or Portal Switch. **Every AVYAY and NAPDDR frame hugs correctly.**

### 2.4 Two finished screens are in no section

`e-anudaan-dashboard` (`51326:6489`, 1440×1662) floats between the login section and
NAPDDR. `e-anudaan-step2-post-bulk-upload` (`51643:14083`, 1440×2942) sits **136px to the
right of the NAPDDR section's edge** — clearly a NAPDDR step-2 state never pulled in, and
it carries five hidden alternate states (`Recommended Badge`, `Format Info`, two
`Validation card`s, an `Info card`) that exist nowhere else.

Neither is findable by section.

### 2.5 No mobile version of any application screen

35 frames at 1440, 9 at 375. **All nine mobile frames are auth.** There is no drawn
answer for a wizard, a document checklist, a review summary or the dashboard on a phone —
which for a citizen applying for a grant is the common case, not the exception.

### 2.6 No state vocabulary, and three naming systems

Only SHRESHTA names states (`-empty` / `-filled`). AVYAY and NAPDDR express the same idea
as two identically-named frames stacked vertically. The auth screens encode state **only
in the AuthFormCard's height** — 668 vs 696 — with nothing in any name.

Twelve frames reuse a name: `E-Anudaan | NGO` ×10, `E-Anudaan | Admin` ×6,
`e-anudaan-select-scheme` ×3, `Portal Switch` ×2, `e-anudaan-step1-application-type` ×2,
`e-anudaan-step1-Project Details` ×2.

Three conventions coexist — `e-anudaan-<step>-<name>`, `step-<n>-<name>-<state>`, and
`E-Anudaan | <Role>`. **None is the house `Role / Screen / State`.**

### 2.7 Ten names for one slot

Content wrappers: `Body` · `Frame` · `main-section` · `workspace` · `Workspace` ·
`workspace-body` · `content-area` · `FormContent` · `Container` · `Content`.
Sidebar containers in three casings. Section cards in eight names. `Frame` appears **256
times across 13 screens**; 99 nodes have an empty name. `e-anudaan-dashboard` and
`step-4-declarations` are built almost entirely from `Frame` and are illegible from the
layers panel.

Inside one component, the mobile `Auth / AuthFormCard` names its submit `Button` while
the desktop one names the same layer `Primary action`. `.Toast Status` (25×) and
`.ToastStatus` (5×) are the same thing; `check_circle` and `check-circle` co-exist 18
each on one screen.

### 2.8 Sections that do not contain their content

| Section | Declared h | Content bottom | Result |
|---|---:|---:|---|
| `NAPDDR` | 3314 | 3734 | overflows 420px; right padding 48 where everything else uses 100 |
| `LOGIN & AUTHENTICATION` | 2727 | 3824 | overflows 1097px, and is **3008px wider than its content** |
| `AVYAY` | 3054 | 2894 | 160px slack |
| `SHRESHTA` | 2183 | 2083 | ✅ clean 100px hug |

Row pitch is 1480 in AVYAY and NAPDDR, 1540 in SHRESHTA. The login sub-sections sit at
y=1454 / 1467 / 1467 / 1467 — a 13px misalignment on the first.

### 2.9 Two stepper treatments

AVYAY/NAPDDR draw one; SHRESHTA and the Grant-in-Aid frames draw another. A citizen who
applies to two schemes meets two different progress bars for the same act.

---

## 3. What was good

Worth recording, because it is what the rest should be brought up to.

- **The auth geometry is the one clean set.** Hero 922 (64.0%) / form column 518 at
  x=922 / card 390 with 64px gutters on desktop; 375 / card 343 with 16px gutters on
  mobile. Consistent across all 18 screens, and it already matches
  `PortalLoginTemplate`.
- **Every AVYAY and NAPDDR frame hugs its content correctly.**
- **`Auth / PortalLoginShell`, `Auth / AuthFormCard`, `Auth / LoginHero` and
  `Auth / PortalList` are real library organisms**, instanced 58 times across 18 screens
  rather than redrawn.
- The application skeleton is genuinely consistent on 25 of 26 screens:
  `navbar 134 → sidebar + content column → Footer - Bottom Strip 52`.

---

## 4. Recommended repairs, in order

Not done in this pass by decision — the file may be open to others, and the code
templates encode the corrected geometry regardless.

1. Collapse sidebars to 300/88 and measures to 1140/1352 across the 6 SHRESHTA screens.
2. Resize the seven truncated frames to their content.
3. Pull the two orphans into sections.
4. Pick one `select-scheme` design; make SHRESHTA's four frames `radio-card` instances.
5. Pick one stepper treatment and one masthead height.
6. Rename to `Role / Screen / State`; add the missing state words.
7. Rename the ten content wrappers to one name.
8. Draw the mobile application screens, or accept the code templates' answer for them.
