# E-Anudaan Handoff Page — How It Is Organised

**File** `evmNmlK8g4VYwJVu2FwSGV` · **Page** `E-Anudaan` (`51313:165608`) · **Organised** 17 Sep 2026 · **Desktop and phone complete** 18 Sep 2026
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

Every name is plain English with no codes (decided 17 Sep 2026). Screen counts include notes.

```
START HERE
  Guide to This Page
SCREENS BY WHO USES THEM
  Everyone — Signing In
    NGO Sign-In with Username and Password   (6 screens)
    NGO Sign-In with DARPAN ID   (4 screens)
    NGO Sign-In through NGO-DARPAN — Needs Discussion   (12 screens)
    Officer Sign-In   (4 screens)
    Forgot and Reset Password   (3 screens)
  NGO — Applying for a Grant
    Dashboard and Notifications   (4 screens)
    Choose a Scheme   (4 screens)
    SHRESHTA Mode 2 Application Form
      New Application — 7 Steps   (8 screens)
      1st Instalment Claim — 7 Steps   (7 screens)
      2nd Instalment Claim — 4 Steps   (4 screens)
      3rd Instalment Claim — 4 Steps   (4 screens)
    SMILE (Garima Greh) Application Form
      New Application — 7 Steps   (7 screens)
      1st Instalment Claim — 7 Steps   (7 screens)
      2nd Instalment Claim — 4 Steps   (4 screens)
    AVYAY Application Form
      New Application — 8 Steps   (12 screens)
      1st Instalment Claim — 7 Steps   (7 screens)
      2nd Instalment Claim — 4 Steps   (5 screens)
      3rd Instalment Claim — 4 Steps   (4 screens)
    NAPDDR Application Form
      New Application — 10 Steps   (10 screens)
      1st Instalment Claim — 11 Steps   (11 screens)
      2nd Instalment Claim — 4 Steps   (4 screens)
      3rd Instalment Claim — 4 Steps   (4 screens)
    Uploading Documents — Needs Discussion   (1 screens)
      Each Document's Status   (16 screens)
      Sorting Files and Document History   (3 screens)
  NGO — After Applying
    My Applications   (4 screens)
    Application Details   (5 screens)
    Deficiencies and Corrections   (3 screens)
    Changing Answers After Submitting — Needs Discussion   (5 screens)
    Utilisation Certificate and Inspection Meeting   (4 screens)
    Project Location and Bank Accounts   (3 screens)
    Beneficiaries and Staff   (5 screens)
    Attendance   (2 screens)
    CCTV Setup   (9 screens)
  Officers — Reviewing Applications
    My Queue
      Programme Division   (6 screens)
      Integrated Finance Division   (5 screens)
    Reviewing an Application   (19 screens)
    All Applications   (4 screens)
    Sanctioned, Returned, Rejected and Forwarded Lists   (6 screens)
    Queries   (2 screens)
    Notifications   (1 screens)
  Officers — Records and Reports
    NGO Directory and NGO Profile   (3 screens)
    Bank Account Change Requests   (1 screens)
    Payment Status   (1 screens)
    Reports and Analytics   (3 screens)
    Audit Trail   (3 screens)
    Project Records and CCTV Compliance   (4 screens)
  Programme Director — Sanctioning
    Sanction Desk   (1 screens)
    Examining and Sanctioning an Application — Needs Discussion   (5 screens)
    Sent Applications and Inspection Reports   (4 screens)
  PMU Field Officer — Inspections
    Inspection Dashboard   (1 screens)
    Inspections   (1 screens)
    Institutions and Location Changes   (3 screens)
SHARED PARTS
  Page Frame — Header and Side Menu
  Access Denied and Page Not Found
  Error Messages
  Form Step Content — SHRESHTA and SMILE
  Reference Images
OLD SCREENS — DO NOT USE
  Replaced Screens — 17 Sep 2026
  Leftover Pieces — To Be Deleted
```

## 3. Needs discussion — red only where screens may change

Decided 17 Sep 2026: red marks only a journey whose screens a decision could still change. The first pass marked
13 and read as "so much discussion pending"; nine were questions that change no screen and are now a plain list
on the Status page.

| Journey (red) | Open point | Drawn for now |
|---|---|---|
| NGO Sign-In through NGO-DARPAN | The provider's consent screen and return states, to confirm with NGO-DARPAN | Consent screen is a labelled placeholder |
| Uploading Documents | Documents for 2nd and 3rd instalment claims; keeping a "not valid" document with an explanation; showing the confidence percentage; last year's documents as permanent | The document list and rule the built portal uses today |
| Changing Answers After Submitting | Which answers may change, which need a reason, which are locked | The design team's proposed rule for each answer |
| Examining and Sanctioning an Application | Who sanctions SHRESHTA | The Programme Director sanctions, returns or rejects |

**Listed on the Status page, not red:** the deficiency answer period; AVYAY's release pattern; SMILE's missing test
recording; NAPDDR's coordinates, scores and SLCA fields; "Status of Institution"; typed vs counted beneficiaries;
the phone header's DBIM difference; renewal lists; the Programme Director screens not yet in the test portal.

## 4. Still needs a person

| What | Why a person | Where |
|---|---|---|
| Name a version, e.g. “Handoff structure — 17 Sep 2026” | version naming is not in the Plugin API | File → Version history |
| Confirm and delete the 11 stray nodes | deleting is a person's call | D · Stray Nodes |
| Timed find test: a developer and a reviewer find a screen by its ID | the structure is only proven when people use it | rule §11 |
| ~~Phone screens for the rest of the flows~~ | **Done 18 Sep 2026** — every desktop screen has a phone version | the Mobile row of each journey |

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
| `062ba317` NGO sign-in through NGO-DARPAN; captcha and DARPAN ID + PAN removed | "NGO Sign-In with Username and Password" and "NGO Sign-In with DARPAN ID" still show the captcha | **Kept, not archived — a person decides.** They were briefly moved to the archive on 17 Sep and restored the same day; the difference is on the Status page |
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

## 5a. Desktop and phone, completed 18 Sep 2026

**Every desktop screen now has a phone version** — 221 in the Mobile rows, 191 of them new. Each is built from
the same library components as its desktop screen, at 375 wide, and sits at the same x as the screen it matches.

| What the phone version does | Why |
|---|---|
| Tables become one card per row, label and value side by side | the built portal does the same at 375; a 7-column table cannot be read on a phone |
| Side-by-side fields and summary cards stack | measured: any row whose parts would fall under ~90px is stacked |
| The step bar reads `STEP 3 OF 7` with dots, instead of the seven-label stepper | the seven labels broke a letter per line |
| The wizard's Back and Save and Continue sit in a bar at the bottom of the screen | matches the build's sticky action bar |
| A page title's action moves under the title | otherwise the title is squeezed to a few characters |
| Grids that must stay a grid (the weekly attendance matrix) are clipped, not rebuilt | the build scrolls them sideways |

**Checked by measurement, not by eye alone.** A script walks every phone screen and reports content that runs past
the edge of the screen and text squeezed into a column narrower than 90px. Both were **0** at the end
(they were 963 and 549 mid-way).

**Upload rows, now on the published library.** SAMAVESH was published on 17 Sep with `Document Row` gaining a
`Layout` axis. 556 applicant rows across 62 screens were re-pointed to `Layout=Stacked`, the filter chips were
removed and the drop area put on one line — the build's upload step. The officer's review rows keep `Layout=Columns`.
The 16 rows inside **Upload Documents / Document History** were left on the column row: that sheet lists a file's
versions, not the checklist.

**Sign-in, rebuilt from the library.** The NGO-DARPAN sign-in screen was redrawn with `Auth / SSOButton`,
`Auth / OrDivider` and `Auth / CredentialFields / Identifier + Password`, so "Forgot Password?" sits beside the
Password label and the card carries an arrow, as in the build. The **wrong username or password** state was added
(desktop and phone). Nine NGO-DARPAN screens showed the placeholder "Signing into Organisation Name" and now read
"E-Anudaan".

## 6. Adding to the page

- **A screen:** into the right row of its flow; name `Role / Screen / State`; phone version ends ` · Mobile`.
- **A flow:** a free number in its role (`NGO 145`), then run the layout from `layout-engine.js`
  and regenerate the Portal Map and Status.
- **A role:** a new column in B, in lifecycle order; flows numbered from 10 with a new role code.
- **Then:** `npm run check:figma-handoff -- --portal E-Anudaan --fresh --strict`, and refresh the snapshot.
