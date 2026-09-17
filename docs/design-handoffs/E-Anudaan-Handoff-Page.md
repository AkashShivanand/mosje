# E-Anudaan Handoff Page — How It Is Organised

**File** `evmNmlK8g4VYwJVu2FwSGV` · **Page** `E-Anudaan` (`51313:165608`) · **Organised** 17 Sep 2026
**Standard** `.claude/rules/figma-handoff-page-structure.md` · **Snapshot** `tools/figma-handoff-structure/manifests/e-anudaan.json`
**Gate** `npm run check:figma-handoff -- --portal E-Anudaan --strict` — **conformant** (0 identity, 0 visual)

The first portal page on the estate-wide handoff structure, and the example the others copy.
No screen was redrawn: sections and screens were re-parented (node ids kept, so existing links
still work), renamed, reordered and recoloured; four guide frames and thirteen discussion notes
were added.

## 1. Before and after

| | Before | After |
|---|---|---|
| Top level | 15 numbered sections plus a stray-node strip, in no order in the layers panel | 4 zones: A Start Here, B Screens by User Role, C Shared Building Blocks, D Archive |
| Grouping | by topic, numbered by position (`1 · …` to `15 · …`) | by user role, 7 columns; flows with fixed IDs (`NGO 30`) |
| Canvas | one strip, 18,544 × 201,143px | role columns side by side, ≈ 122,000 × 125,000px |
| Phone screens | mixed into desktop rows (32) | in a Mobile · 375 row, each under its desktop screen |
| Dialogs | the officer review's 8 dialogs 9,000px from the screen | in a Dialogs & Overlays row under their flow |
| Colour | 15 white sections; some groups lighter than their parent | grey by depth; red for pending discussion |
| Guide | none | Cover, Portal Map (linked), How to Read, Status & Change Log |
| Check | 169 violations | 0 |

## 2. The page

```
A · START HERE
  Guide to This Page  (4 frames)
B · SCREENS BY USER ROLE
  Everyone · Sign In & Account
    ACCESS 10 · Sign In — NGO, Credentials
    ACCESS 20 · Sign In — NGO, DARPAN ID
    ACCESS 25 · Sign In with NGO-DARPAN — Return States · Pending Discussion
    ACCESS 30 · Sign In — Officer
    ACCESS 40 · Password Recovery
  NGO Applicant · Apply for a Grant
    NGO 10 · Dashboard & Notifications
    NGO 20 · Choose a Scheme
    NGO 30 · SHRESHTA Mode 2 Application   [New Application · 7 Steps | 1st Instalment · 7 Steps | 2nd Instalment · 4 Steps | 3rd Instalment · 4 Steps]
    NGO 40 · SMILE (Garima Greh) Application · Pending Discussion   [New Application · 7 Steps | 1st Instalment · 7 Steps | 2nd Instalment · 4 Steps]
    NGO 50 · AVYAY Application · Pending Discussion   [New Application · 8 Steps | 1st Instalment · 7 Steps | 2nd Instalment · 4 Steps | 3rd Instalment · 4 Steps]
    NGO 60 · NAPDDR Application · Pending Discussion   [New Application · 10 Steps | 1st Instalment · 11 Steps | 2nd Instalment · 4 Steps | 3rd Instalment · 4 Steps]
    NGO 70 · Upload Documents · Pending Discussion   [Document Row States | Placement Tray & Document History]
  NGO Applicant · After Submission
    NGO 110 · My Applications
    NGO 120 · Application Detail
    NGO 130 · Deficiencies & Correction · Pending Discussion
    NGO 135 · Which Answers Can Change · Pending Discussion
    NGO 140 · Utilisation Certificate & Inspection Meeting
    NGO 150 · Project Location & Bank Accounts
    NGO 160 · Beneficiaries & Staff · Pending Discussion
    NGO 170 · Attendance
    NGO 180 · CCTV Setup
  Officer · Process Applications
    OFFICER 10 · My Queue   [Programme Division | Integrated Finance Division]
    OFFICER 20 · Review an Application · Pending Discussion
    OFFICER 30 · All Applications
    OFFICER 40 · Registers
    OFFICER 50 · Queries
    OFFICER 60 · Notifications
  Officer · Oversight & Records
    OFFICER 110 · NGO Directory & NGO 360
    OFFICER 120 · Bank Account Changes
    OFFICER 130 · Payment Status
    OFFICER 140 · Reports & Analytics
    OFFICER 150 · Audit Trail
    OFFICER 160 · Project Records & CCTV Compliance
  Programme Director · Sanction
    DIRECTOR 10 · Sanction Desk · Pending Discussion
    DIRECTOR 20 · Examine and Sanction · Pending Discussion
    DIRECTOR 30 · Sent & Inspection Reports · Pending Discussion
  PMU Field Officer · Inspect
    PMU 10 · Inspection Dashboard
    PMU 20 · Inspections
    PMU 30 · Registers
C · SHARED BUILDING BLOCKS
  Portal Shell · Pending Discussion  (3 frames)
  System Status Screens  (2 frames)
  Service Errors  (8 frames)
  Wizard Step Bodies — SHRESHTA & SMILE  (8 frames)
  Reference Assets  (1 frames)
D · ARCHIVE — DO NOT BUILD FROM
  Superseded — 17 Sep 2026  (10 frames)
  Stray Nodes — Sweep Before Handoff  (11 frames)
```

Four groups were added to the page by other sessions shortly before the reorganisation; each was
filed by user role: NGO-DARPAN return states → `ACCESS 25`, Which Answers Can Change → `NGO 135`
(its one officer screen went to `OFFICER 20`'s desktop row), Project Records & CCTV Compliance →
`OFFICER 160`, Service Errors → C.

## 3. Pending discussion — red on the canvas, each with a note

Designed to the recommended approach for now; each needs a decision before build. Questions are
from `docs/plans/2026-09-16-e-anudaan-delivery-status.md` §4 unless stated.

| Flow | Open question | Drawn for now |
|---|---|---|
| ACCESS 25 · Sign In with NGO-DARPAN | Sign-in through NGO-DARPAN replaces the captcha and DARPAN ID + PAN form; consent screen and return states to confirm with NGO-DARPAN (commit `062ba317`) | Consent screen is a labelled stand-in. If adopted, ACCESS 20 moves to the archive |
| NGO 40 · SMILE (Garima Greh) | Q-5 — no UAT recording to check against | Shared SHRESHTA Mode 2 step pattern |
| NGO 50 · AVYAY | Q-4 release 40-40-20 or half-yearly; Q-11 renewal picker lists “awaiting sanction” | As the live portal lists them |
| NGO 60 · NAPDDR | Q-6 coordinates, scores, SLCA fields; Q-11 | As the live form has them |
| NGO 70 · Upload Documents | Q-3 documents for 2nd/3rd instalment; Q-10 three Document Centre decisions (`2026-09-16-e-anudaan-document-centre.md` §6) | Live rule: “not valid” must be replaced or checked again; no percentage shown |
| NGO 130 · Deficiencies & Correction | Q-1 how long an applicant has to answer | No deadline until confirmed |
| NGO 135 · Which Answers Can Change | Per-field edit policy is the design team's proposal (commit `cd31d83d`) | Editable / editable with a reason / locked; changes shown to the officer |
| NGO 160 · Beneficiaries & Staff | Q-8 count from the roster, or typed | Confirm before making it read-only |
| OFFICER 20 · Review an Application | Q-7 meaning of “Status of Institution” | The live label |
| DIRECTOR 10, 20, 30 | Q-2 who sanctions SHRESHTA; the Programme Director console is not implemented on dev (`docs/research/eanudaan-admin-dev.mosje.in/INVENTORY.md` §17) | Director sanctions, returns or rejects — the design team's proposal |
| C · Portal Shell | Q-9 phone masthead deviates from DBIM | As built |

When a question is decided: drop ` · Pending Discussion` from the name, delete the note, re-run the
layout (the red goes), update the Status & Change Log.

## 4. Still needs a person

| What | Why a person | Where |
|---|---|---|
| Name a version, e.g. “Handoff structure — 17 Sep 2026” | version naming is not in the Plugin API | File → Version history |
| Confirm and delete the 11 stray nodes | deleting is a person's call | D · Stray Nodes |
| Timed find test: a developer and a reviewer find a screen by its ID | the structure is only proven when people use it | rule §11 |
| Phone screens for the rest of the flows | deferred 16 Sep 2026 | the empty slots in each Mobile row |

## 5. Sync with the build — 17 Sep 2026

Measured against `main` at `e8fb4909`, running on :3007. The build was re-captured at 1440 (190
screens, 8 dialogs, 0 failures), at 375 (190), and the NGO-DARPAN, CCTV and edit-policy states were
re-shot with their own scripts — every capture with the page's visible text saved beside it.

**How it was measured, and why the old score was dropped.** The 16 Sep comparison scored the first
screenful as a shrunk greyscale image, with < 4 read as "identical". Re-run today, that score put
*wrongly paired* screens under 4 — Project Records against Weekly Attendance scored 3.4 — so it cannot
prove two screens agree. The comparison was replaced by the **words on the screen**: each Figma frame's
text (REST) against the build's visible text, as word bags with page chrome removed; the changed
surfaces were then checked **side by side by eye**.

**What changed in the build since the Figma was drawn** (`git log` on the portal and the design
system since 16 Sep), and what that meant for the page:

| Build change | Figma | Result |
|---|---|---|
| `062ba317` NGO sign-in through NGO-DARPAN; captcha and DARPAN ID + PAN removed | ACCESS 10 drew the captcha login; ACCESS 20 the DARPAN ID + PAN form | **Synced.** The NGO-DARPAN login is now ACCESS 10; the ten old frames are in the archive; ACCESS 20 is retired |
| `062ba317` NGO-DARPAN return states | ACCESS 25, 11 frames | **In sync** — word match 0.96–0.98 on every state |
| `cd31d83d` edit policy and error catalogue | NGO 135, OFFICER 20, C · Service Errors | **In sync** where a matching capture exists (0.94–0.98); four states could not be re-shot (see below) |
| `6308c62d`, `065b0e06` CCTV module and project records | NGO 180, OFFICER 160, OFFICER 110 | **In sync** on the states re-shot (0.93–0.99); lower scores are different sample projects, checked by eye |
| `29d670d2` the upload row reads in two lines, commands on the row; `134308ae` validation catalogue | **every Upload Documents frame** | **OUT OF SYNC — not fixed here.** See below |
| `c63f1e76`, `6ed5bb1e`, `edf0f95d`, `0fc59dde` demo fills | demo dock only | no screen change |

**Out of sync, and why it was not fixed in this file.** The build's upload row is two lines — the
document's name, then its status and file — with the command on the right and no "Needs your attention
/ Being checked / Ready" filter chips. Every Upload Documents frame on the page (the 14 row states,
the placement tray and history, and each scheme's upload step — about 29 frames) still draws the older
three-column row with the chips. Those rows are instances of **`Document Row`** in the **SAMAVESH
library** (`58278:1079`), last published 16 Sep 2026 23:01 IST — two hours before the build changed.
The fix belongs on the library master, then a **publish** (a person, in Figma), then accepting the
update in this file. Redrawing 29 copies here would leave the library wrong for every other file.

**Minor drift on the new login frame:** "Forgot Password?" sits under the password field (build: beside
its label), and the NGO-DARPAN card reads "Continue" (build: an arrow). Not yet drawn for the new login:
the invalid-credentials state and its phone frame.

**Not verified** (no build capture reaches the state): filled-form wizard variants, the
officer's raise-deficiency and send-deficiency dialogs, four service errors (applications closed, save
conflict, timeout toast, session banner), and the phone frames beyond the screens above.

## 6. Adding to the page

- **A screen:** into the right row of its flow; name `Role / Screen / State`; phone version ends ` · Mobile`.
- **A flow:** a free number in its role (`NGO 145`), then run the layout from `layout-engine.js`
  and regenerate the Portal Map and Status.
- **A role:** a new column in B, in lifecycle order; flows numbered from 10 with a new role code.
- **Then:** `npm run check:figma-handoff -- --portal E-Anudaan --fresh --strict`, and refresh the snapshot.
