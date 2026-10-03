# E-Anudaan Handoff File — How It Is Organised

**File** `E-Anudaan [Handoff]` (`K0B3vuOTXpxw6kt0px2Cqo`, UX4G – Digital India Corporation) · **Moved** 30 Sep 2026 from
`MoSJE Portal [Handoff]` (`evmNmlK8g4VYwJVu2FwSGV`, page `51313:165608`, which now holds only a note pointing here)
**Standard** `.claude/rules/figma-handoff-page-structure.md` §10a · **Snapshot** `tools/figma-handoff-structure/manifests/e-anudaan.json`
**Gate** `npm run check:figma-handoff -- --portal E-Anudaan --strict` — checks all 15 pages

## 0. The file (30 Sep 2026, tidied 1 Oct 2026)

568 screens had outgrown one page of a twelve-portal file: the NGO column alone ran 217,000px tall. The
portal now has a file of its own, organised in the order an application moves.

| Page | Holds | Screens | Journeys |
|---|---|---|---|
| Cover | the file's cover frame | — | — |
| Start Here | Cover, Portal Map (every journey linked, with its page), How a Grant Moves (the walkthrough of 1 Oct 2026, every stage linked), How to Read This File, Status and Change Log | — | — |
| Everyone · Signing In | NGO and officer sign-in, forgotten password | 42 | 5 |
| NGO · Starting an Application | dashboard, choosing a scheme, uploading documents | 43 | 3 |
| NGO · NAPDDR Application Form | new application and three instalment claims | 58 | 1 |
| NGO · AVYAY Application Form | new application and instalment claims | 52 | 1 |
| NGO · SMILE (Garima Greh) Application Form | new application and instalment claims | 36 | 1 |
| NGO · SHRESHTA Mode 2 Application Form | new application and instalment claims | 44 | 1 |
| NGO · After Applying and Getting Paid | NGO — After Applying; NGO — Getting Paid | 71 | 10 |
| Officers · Reviewing Applications | the review chain, queues and lists | 73 | 6 |
| Officers · Sanctioning and Inspections | Programme Director; PMU Field Officer | 34 | 6 |
| Officers · Paying a Sanctioned Grant (PFMS) | Programme Division Maker and Checker — Paying a Sanctioned Grant | 61 | 3 |
| Officers · PFMS Set-Up | Bureau — Setting Up PFMS | 20 | 2 |
| Officers · Records and Reports | records, reports, payment reports, audit trail, NGO directory | 31 | 6 |
| Shared Parts | page frame, error pages, reusable form content | 22 items | — |
| Old Screens — Do Not Use | replaced screens, each with a note naming its replacement | 12 screens | — |

565 screens, 10 user groups, 45 journeys, 10 needing discussion (9 until the walkthrough of 1 Oct 2026, §5d). Divider pages separate Everyone, NGO and
Officers in the page list — the audiences are user roles, so the PFMS pages sit with the Officers (1 Oct 2026).

**How each page reads.** A `START HERE` guide first (who uses the page, its journeys, counted screens, a
link back to the Portal Map), then the screens: user groups and their journeys stacked top to bottom in
the order a case meets them; inside a journey, Desktop, Mobile (each phone screen under its desktop
screen) and Pop-ups and Dialogs, left to right in the order a person sees them.

**How it moved.** The Plugin API cannot move layers between files, so a person copied the page and pasted
it into the new file (597 frames, checked name by name). Everything after that was moved *within* the
file, which keeps node ids. The paste did change every id, and the Portal Map's links pointed back at the
old file; all 46 were relinked to their journey sections. Sections below describe the page as it was
organised on 17 Sep 2026; node ids quoted there are the old file's.

**Cover.** A 1920 × 1080 frame (Figma's recommended 16:9 thumbnail), set as the file thumbnail. Everything
that must survive Figma's crops — 4:3 in the team view, 1:1 in the list — sits inside x 264–1656: the
SAMAVESH `Navbar/BrandLockup` (emblem, Ministry, Department) at the left of a top bar and, at the right, the
circular SAMAVESH seal alone, with no wording beside it — SAMAVESH is the unified portal E-Anudaan belongs to,
and the seal names it; a hairline beneath, then the eyebrow (handoff file, version,
date), the portal's name, what it does, and the file's counts. Below, a browser window and a phone rise out
of a `bg/brand/primary/boldest` stage, the phone deliberately in front of the browser's right edge. The seal is
60px, matched to the emblem, and was RESCALED (a uniform transform), not resized — resizing this remote
component distorts its inner groups (`ds-documentation-standard.md` §5); rescaling was checked at 3× and does not. Every fill is a SAMAVESH variable; all text uses published styles except
the 152px title and the 24/22px standfirst and counts, set in Noto Sans because the library's ramp stops at
80px (the rule for slide-scale text in `CLAUDE.md` › Figma libraries).

**The screens on the cover are COPIES, and they are refreshed by hand.** They are copies of
`NGO / Dashboard / With Applications` and its mobile version on NGO · Starting an Application, named
"Copy of … — refresh from NGO · Starting an Application". The two screens were briefly turned into components
so the cover would follow them; that was reverted on 1 Oct 2026 — a handoff screen is a frame a developer
reads, not a component anyone should instance. When the dashboard changes, delete the two copies, clone the
screens into the cover's `Screen` frames and rescale (0.75 browser, 0.72 phone); after the rescale, set the
phone copy's navbar to fill, because rescaling resets an instance to its master's 412px width.

**Still for a person:** name the first version in version history (the API cannot).

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
  Replaced Screens — 1 Oct 2026
  Replaced Screens — 17 Sep 2026
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
| ~~Confirm and delete the 11 stray nodes~~ | **Done 1 Oct 2026** — deleted on the owner's instruction | — |
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

## 5b. PFMS payment leg — 30 Sep 2026

The payment leg of the NeGD BRD (*Integration of PFMS with the e-Anudaan Portal*, v1.0) was drawn from the
SAMAVESH library to the page's standard. Every part is a library instance, bound to SAMAVESH variables and
text styles; the content is the prototype's seeded case (Sankalp Seva Sansthan, `SAN/2026-27/04609`,
₹25,50,000) unless a screen shows a different case on purpose.

| User group (column) | Journey | Desktop | Mobile | Dialogs |
|---|---|---|---|---|
| Programme Division — Paying a Sanctioned Grant | Preparing a Payment Advice | 18 | 7 | — |
| | Authorising a Payment Advice — *Needs Discussion* | 5 | 2 | 8 |
| | Following a Payment — *Needs Discussion* | 8 | 1 | 1 |
| Bureau — Setting Up PFMS | Completing Legacy Files — *Needs Discussion* | 5 | 1 | 2 |
| | Keeping PFMS Set-Up Current | 8 | 1 | 2 |
| NGO — Getting Paid | PFMS Payee Code and Payment — *Needs Discussion* | 6 | 3 | — |
| Officers — Payment Reports | Payment Reports | 6 | 1 | — |

85 screens in all. BRD coverage, screen by screen: `docs/plans/2026-09-30-e-anudaan-pfms-coverage-checklist.md`.

**Why the NGO journey is its own column.** Adding it to `NGO — After Applying` would have made ten journeys in
one column; the rule allows nine. The credit is the last thing that happens to a grant, so the column sits after
the Bureau's.

**Red, and why.** Four journeys carry a note, each tracing to `docs/plans/2026-09-29-e-anudaan-pfms.md` §4:
questions 1, 2, 5 and 10 (authorising), 3 and 6 (following a payment), 8 (legacy files) and 7 (the NGO's
view). Questions 4, 9, 11 and 12 do not change a screen and are listed on the Status page instead.

**Old screens were not moved.** The earlier `Payment Status` (Officers — Records and Reports), `Project Bank
Accounts` and `Application Details` screens stay where they were. The PFMS journeys draw their new versions,
and the Status page asks a person to decide whether the old ones are replaced.

**New shared part.** `Form Step Content / SHRESHTA Mode 2 New Application / Step 4 — Bank, Beneficiaries & Grant
— PFMS Payee Code` sits beside the original in `SHARED PARTS`. It adds the typed-twice account number, the PFMS
registration question, the payee code and its confirmation tick (FR-NGO-001/002). The original is unchanged, so
no existing screen moved.

**Checked, not assumed.** 85 frames were walked, including the content slots inside library instances.
- Every instance's component key is one of the SAMAVESH library's 177 component sets.
- No text lacks a text style, and no fill or stroke lacks a variable.
- The one local component is the PFMS variant of the NGO form step described above.

**Four library gaps — closed 30 Sep 2026** (SAMAVESH [PR #660](https://github.com/AkashShivanand/mosje/pull/660), published).
- `Modal` gained a Content slot. The page's **23 composed dialogs now use the library Modal**, sized to the
  code's widths (384 / 448 / 560 / 640). *Return Order* stays a `SideSheet`, which it always correctly was.
- `Stepper / Collapsed` is built from `Stepper / Dot`; the five Maker phone steps now mark their own stage.
- `EmptyState` gained Description; the two PFMS empty states carry it in the component.
- `Chart` Type=Bar is built from `Chart / Bar`; Failure Trend draws July 2026's single reading as a real bar.
  The screen now runs to 1076px so the table below it is not cut off.

Only the instances changed here were moved to the new library version. Other SAMAVESH updates in this file
wait for someone to accept them in Figma's Libraries panel.

**Build notes found while drawing.** A `use_figma` call that clones a frame and then edits instances inside a
cloned slot (side-menu items, sizing) often does not keep those edits. A second pass is needed, and one was run
over every new frame. Alert body text keeps a stale line break until its characters are reset after resizing.

## 5c. Tidy-up and multi-role audit — 1 Oct 2026

Asked for: remove what the file does not need, keep it organised strictly by role and then by flow, and audit it
as a design director, UX lead, UI lead, project manager, developer, business analyst and CEO.

| What | Before | After | Why |
|---|---|---|---|
| The two PFMS pages | `PFMS · Preparing and Authorising Payments`, `PFMS · Set-Up and Payment Reports`, behind their own divider | `Officers · Paying a Sanctioned Grant (PFMS)`, `Officers · PFMS Set-Up and Payment Reports`, after Sanctioning and before Records and Reports; the extra divider removed | PFMS is a payment system, not a user role; everyone on those pages is a Ministry officer (decided by the owner, 1 Oct 2026) |
| Old Payment Status screen (desktop and phone) | a journey of its own in Officers — Records and Reports | in Old Screens, faded, in `Replaced Screens — 1 Oct 2026`, with a note naming `Following a Payment` | two different Payment Status designs invited a developer to build the stale one (decided by the owner, 1 Oct 2026) |
| Leftover pieces | 11 fragments (table cells, project ID cells, an empty state, a document row) in `Leftover Pieces — To Be Deleted` since 17 Sep | deleted, with their section | marked for deletion two weeks earlier; the owner asked for unnecessary groups to be removed |
| Replaced-screen notes | route paths and transcript references (`/ngo/attendance-master`, `T264–271`), placed inconsistently, one screen without a note | one plain-words note above every replaced screen, naming the page and journey that replaced it | a reviewer could not tell what to use instead |
| Two journeys' rows | Pop-ups and Dialogs sat between Desktop and Mobile in `Project Location and Bank Accounts` and `Examining and Sanctioning an Application` | Desktop, Mobile, Pop-ups and Dialogs, as everywhere else | each phone screen sits under its desktop screen (§3) |
| Shared Parts order | Reference Images first, Page Frame last | Page Frame, Access Denied and Page Not Found, Error Messages, Form Step Content, Reference Images | the order the rule and this doc list them |
| Start Here | Portal Map named the PFMS pages and listed Payment Status; Status listed two finished items as open and said every screen has a phone version | Portal Map relabelled, Records and Reports card last (page order), Payment Status gone; Status corrected, 1 Oct entry in the change log | the guide must describe the file as it is |
| Cover counts | 541 screens, 46 journeys, Version 1, 30 Sep | 539 screens, 45 journeys, Version 1.1, 1 Oct | recounted from the canvas |

| Programme Director's examine screen | one state plus three confirmations | four more states, desktop and phone: sanctioning less than sought, sanction amounts not valid, reason for return missing, read-only (the file is not with you) | sanctioning is the Department's key decision and was the least drawn; every state and message is the built review screen's (`review-shell.tsx`, `officer-forms.ts`) |
| PMU field officer's inspections | one screen each for the dashboard and the list | six dialogs in a new Pop-ups and Dialogs row: Schedule Inspection, its missing-date error, Record Inspection, its two errors, the confirm-before-submit, and the filed Inspection Report | filing the report is the field officer's job and was not drawn; content and messages are the build's (`worklist-table.tsx`, `demo-forms/inspection-report.ts`) |
| Payment column | `Programme Division — Paying a Sanctioned Grant` | `Programme Division Maker and Checker — Paying a Sanctioned Grant`; the Portal Map card reads Maker and Checker | the BRD's actors are the Maker and the Checker, and they sign in separately (`roles.ts`) |
| How to Read This File | no list of who is who | a Who Is Who section: every column mapped to the people and the sign-in roles in the build | four names pointed at overlapping officers |
| Status and Change Log | open questions with no one named | who answers each (the Ministry; PFMS ones NeGD and the Ministry), a link to the BRD coverage checklist, a change-log entry | a question without an owner is not answered |
| Phone-only filter sheet | `Officer / All Applications / Filters — Mobile` | `… / Filters (Phone Only) — Mobile` | it read as a missing desktop screen |
| Each scheme form's page guide | no pointer past the last step | a line linking to Application Submitted on NGO · Starting an Application | the submitted screen is shared by all four forms and sat where nobody looked for it |
| A phone label on the examine screen | the Non-Recurring Grant asterisk floated at the field's right edge | beside its label | the label had been set to fill the row |
| `check:figma-handoff` | no way to write the manifest | `--portal <Portal> --snapshot` writes `manifests/<portal>.json` from the check's own REST reads, and refuses when a page could not be read | the manifest had been assembled by hand |

**Not changed:** no existing screen's design (the four states and six dialogs are additions), no red marking, and no
node id (every move kept its id, so links and comments survive).

**The 9 loose PFMS screens, filed (on the owner's instruction).** A parallel session drew them at the
page root while this one ran (node ids from 91:…). Each went into its journey's Desktop row beside the screen it
varies, following the state-order rule; the rows were reflowed and every phone screen realigned under its desktop
partner: Credit Failed at Bank (after Paid), Returned by PFMS and Financial Year Expired (after Returned and
Cancelled), Not the Designated Checker (after You Prepared This Advice), the Payment Advices list Returned by PFMS
(after Not Accepted by PFMS), Step 1 — DDO Not Active for e-Bills and Step 2 — CNA Exception Reason (after their
steps' error states), and Returned by PFMS and A Fresh Payment Advice (after Returned by the Checker). No screen's
content was touched.

**And the 2 NGO screens.** The same session then added `NGO / Project Bank Accounts / The Bank Could Not Credit
a Grant` and `NGO / Application Details / Bank Account Needs Checking` at the root of `NGO · After Applying and
Getting Paid`. Their positions and heights match the screens they were copied from, so each went into `PFMS Payee
Code and Payment` beside its source: after `PFMS Payee Code Needed` and after `Payment in Process`.

**Then the PFMS session's own pass** (same day, coordinated so the two sessions never wrote at once): a fresh
payment advice from a returned-and-cancelled order, the Return Memo row, SHRESHTA Mode 1 in the PFMS set-up with an
`Add Scheme (Dialog)`, the SHRESHTA heads corrected to their own code, `Programme Director / Examine an
Application / Bank Details Incomplete`, and `Keeping PFMS Set-Up Current` marked Needs Discussion (Mode 1's full
form waits on the business analyst). This session then set the counts: Cover 566, Sanctioning guide 34, Set-Up
guide 27 screens and 2 needing discussion, and Start Here's cover guide 9 needing discussion.

**The last two PFMS screens** (1 Oct 2026): `Officer / Payment Advices / Drafts`, with one saved advice, and
`Officer / Payment Advices / Returned by PFMS — Mobile`, both copied from their neighbours in `Preparing a Payment
Advice` and placed by the layout engine. The selected tab on `Officer / Payment Advices / Returned by PFMS` now carries
the same dark blue as its sibling queues. Counts: Cover 568, the PFMS page's Start Here 61.

**Checked:** `check:figma-handoff -- --portal E-Anudaan --fresh --strict` passes on **all 15 pages** (identity 0,
visual 0), nothing loose at any page root, and `--selftest` catches all nine planted faults.
`manifests/e-anudaan.json` was re-captured with `--snapshot` from that run.

**Open for a person:** accept the waiting SAMAVESH updates in the Libraries panel.

## 5d. The walkthrough of 1 Oct 2026 — recorded, and where it differs

A recording of the Department-side team walking the design team through e-Anudaan and PFMS (Hindi; transcribed and
translated locally) was written up in [`docs/plans/2026-10-01-e-anudaan-walkthrough-notes.md`](../plans/2026-10-01-e-anudaan-walkthrough-notes.md)
and drawn into the file. No screen was changed — Figma is the source of truth and each difference is the Department's
to decide (`figma-code-sync.md` § Screens).

| What | Before | After | Why |
|---|---|---|---|
| Start Here | four guides | a fifth, **Guide — How a Grant Moves** (`132:1052`), after the Portal Map: six lanes, sixteen numbered stages each linked to its journey, the amount step by step, the five schemes, the differences in red and what the walkthrough confirmed | the walkthrough is the clearest account yet of how one grant moves end to end, and a reviewer can follow it to the screens |
| Reviewing an Application | grey | **Needs Discussion**, with a note: four amounts are recorded before the sanction (recommended, proposed, finance's recommended, concurred); none is drawn | a decision would add an amount to these officers' screens |
| Examining and Sanctioning — note | who sanctions SHRESHTA | also: who approves the final amount and issues the sanction order — the walkthrough says the Programme Division's Joint Secretary and Under Secretary | "PD" in the Department's speech is the Programme Division; the column may be a misreading |
| Keeping PFMS Set-Up Current — note | SHRESHTA Mode 1 only | also: is SMILE paid through PFMS (the walkthrough says not); Mode 1's NTA-list basis | SMILE would come off PFMS Set-Up |
| Authorising a Payment Advice — note | Maker and Checker seats open | the walkthrough's answer added: named from the Programme Division's own officers | PFMS question 2 |
| Following a Payment — note | four points | a fifth: a bill the DDO finds not in order goes back to the Checker (drawn: to the Maker) | the return path would change |
| Portal Map | "Officers review … → Programme Director sanctions" | both divisions named in sequence; the sanction marked as needing discussion; links to How a Grant Moves; the Reviewing card red | the one-line flow left out finance entirely |
| Status | 9 Needs Discussion links, **8 of them opening the old shared handoff file** | 10, all opening their journey in this file; a change-log entry | the links were missed when the portal moved on 30 Sep |
| How to Read | Who Is Who without the walkthrough | Programme Director and Maker and Checker lines note the walkthrough; a line saying what "PD" means in the Department's speech | four names pointed at overlapping officers |
| Counts | cover guide 9 need discussion; Reviewing page guide 0 | 10; 1 | recounted |

Each note grew, so the rows beneath it and every journey and user group below it were moved down by the same amount
and their sections grown; nothing else moved. `check:figma-handoff -- --portal E-Anudaan --fresh --strict`: all 15
pages conformant, identity 0 and visual 0.

**Then checked against the PFMS BRD, read in full** (same day). The BRD agrees with the walkthrough that the Under
Secretary, Programme Division issues the sanction and that "PD" is the Programme Division, and places the Maker and
Checker inside that login; it disagrees on who attaches the documents (the Maker) and on SMILE (applicable). The guide
now says which source says what: the Checker stage was corrected to the BRD, the last stage says the NGO is told only
on a confirmed UTR, a sixth difference — Who Attaches the Documents — was added, and the notes on Examining and
Sanctioning, Authorising (plus a new item), Following a Payment and Keeping PFMS Set-Up Current quote the BRD.
Detail: the walkthrough notes §5a.

**Not changed:** no screen, no journey's name other than Reviewing an Application's suffix, no role column.
**Open for a person:** put §7 of the walkthrough notes to the Department.

**The file stays at Version 1** (instruction, 1 Oct 2026). The Cover's "Version 1.1" is set back to "Version 1", and no
named version is added to the version history. Start Here's Change Log gains a line for the last two PFMS screens, and
its Open Items now count 17 phone screens for 68 desktop screens across the PFMS journeys (officers' 14 for 60, the
NGO's 3 for 8), recounted from the canvas.

**Decided, 1 Oct 2026.** Officers' PFMS screens are **desktop only**: signing a payment needs a DSC token on a desktop
computer, so the 17 phone screens already drawn stay and no more are added; the open item is closed and the decision is
in the Change Log. The **NGO sign-in keeps its captcha** on the username-and-password and DARPAN ID screens; the sign-in
will be refined by reading the live portal's flow and data, drawing it here, then building it — the open item now says so.

**The NGO's PFMS drawings are current** (decided 1 Oct 2026). The NGO's bank details are still required: PFMS pays
into the account given on Project Bank Accounts and needs the PFMS payee code entered there. The PFMS drawings are the
same screens with the payee code and the Payment card added, so they replace the older ones without losing a field:

| What | Before | After | Why |
|---|---|---|---|
| `NGO / Project Bank Accounts` and its phone version | current, without the payee code | Old Screens at 40%, each with a note naming `NGO / Project Bank Accounts / PFMS Payee Code Needed` | the PFMS drawing shows the same accounts plus each project's payee code |
| `NGO / Project Bank Accounts / PFMS Payee Code Needed — Mobile` | no phone version | drawn (`142:23323`) from the older phone, with the alert, a payee code line under each account and the code form under Madurai | the NGO portal keeps a phone version of every screen |
| `NGO / Application Details / Grant Released` and its phone version | current, without a Payment card | Old Screens at 40%, notes naming `NGO / Application Details / Grant Credited` | the PFMS drawing adds the credit date, amount and UTR |
| Prototype links on the NGO page | 36 pointing at the older screens | pointing at the PFMS screens | so a click lands on the current drawing |
| Counts | Cover 568, NGO page 74, Old Screens 8 | 565, 71, 12 | recounted from the canvas |
| Start Here | open item on the NGO's payment details | closed; a Change Log line records the decision | decided |

**Not changed:** `Project Bank Accounts / Change Account (Dialog)` and `Project Location Change` stay where they are; the
other Application Details states (Submitted, Action Required, Sanctioned) have no PFMS replacement and stay. One sidebar
link on `NGO / Application Details / Bank Account Needs Checking` still points at the older screen, because the same layer
also carries a link to a screen on another page, which Figma refuses to save; the NGO form pages' sidebar links already
pointed across pages before this change and are left as they were. `check:figma-handoff -- --portal E-Anudaan --fresh
--strict`: all 15 pages conformant.

## 5e. Second tidy-up — 1 Oct 2026, evening

A read-only audit of all 15 pages (no loose, hidden or empty groups; every name on the pattern; every screen
in its right row) found one structural fault and three smaller ones, all introduced by the day's later edits.
Fixed on the owner's instruction, with the PFMS session holding its writes meanwhile.

| What | Before | After | Why |
|---|---|---|---|
| Change Account pop-up | left in `Project Location and Bank Accounts` after Project Bank Accounts was retired, with no screen to open it from | in a new Pop-ups and Dialogs row of `PFMS Payee Code and Payment`, beside the current bank-account screens | a pop-up belongs with the screen that opens it |
| Project location journey | `Project Location and Bank Accounts` | `Project Location Change` (Portal Map too) | it no longer holds a bank-accounts screen |
| Payment Reports | a one-journey group, `Officers — Payment Reports`, on the Set-Up page | a journey in `Officers — Records and Reports`, after Reports and Analytics; the empty group deleted | the group repeated its only journey's name; officers' reports now sit together |
| Set-Up page | `Officers · PFMS Set-Up and Payment Reports`, two groups | `Officers · PFMS Set-Up`, the Bureau's alone | follows the move |
| Screen names | `Everyone / Access Denied (403)`, `Everyone / Page Not Found (404)`, `… / Single Project Page (Replaced)` | codes and the redundant word dropped | names are plain words (§4) |
| Application Details | three states here, three payment states in `PFMS Payee Code and Payment`, no pointer | the page guide links from one to the other | the split is deliberate; the pointer stops a developer missing half the states |
| Counts | Cover guide 566 screens, 11 groups | 565 screens, 10 groups | recounted from the canvas |

**Not changed:** no screen's design; journeys stay 45 and red journeys 10; every move kept its node id, so links
(including the PFMS coverage checklist's) survive.

**Kept on purpose:** a page used by one group keeps that group's column, each scheme-form page keeps
`NGO — Applying for a Grant` around its one form journey, `NGO — Getting Paid` keeps its one journey (the nine-
journey cap), and every page keeps `Guide to This Page`. The standard and its check expect all four.

**Checked:** `check:figma-handoff -- --portal E-Anudaan --fresh --strict` passes on all 15 pages;
`manifests/e-anudaan.json` re-captured with `--snapshot`.

## 5f. The PFMS BRD, item by item — 1 Oct 2026

Every item of the PFMS BRD was checked against the screens, field by field, and the gaps closed in the drawings. The
checklist, in the BRD's own order with each open point in its own row, is
[`docs/plans/2026-10-01-e-anudaan-pfms-requirements-checklist.md`](../plans/2026-10-01-e-anudaan-pfms-requirements-checklist.md):
151 BRD items, 141 drawn, 10 system work with no screen, 17 discussion points.

| What | Before | After | Why |
|---|---|---|---|
| Start Here on the PFMS page | one guide | **Guide — How a Payment Moves** (`158:19200`): 21 steps in six lanes, each linked to its screens | the flow, step by step, for a reader new to the BRD |
| The Checker's screen and the Maker's review (21 screens) | no fixed values; documents by name only | Bill Status, Payment Mode, Sanction Type, Bill Type and e-Sanction rows; each document's Base64 fingerprint and single-use view link; a Previous Request Identifier on a resubmission | Annexure G mirrors every Annexure F field; FR-DOC-001/002; FR-PDM-012 |
| Supporting-document fingerprints (Step 4 and every mirror) | 64 hex characters | Base64 | FR-DOC-001 |
| The NGO's credit notice | headed "Approved" | "Grant Credited" | a grant is never "Approved" (glossary); FR-NTF-001 |
| New-application bank steps, all four schemes (10 screens) | no re-entered account; SMILE and SHRESHTA without the PFMS registration question | Re-enter Account Number everywhere; on the filled-in screens the registration question, **Name as per PFMS**, the payee code and the confirming tick | FR-NGO-001/002, Annexure F.3 |
| Review steps, all four schemes (8 screens) | no PFMS rows | Name as per PFMS, payee code and registration | the review repeats what was entered |
| `Form Step Content / SHRESHTA Mode 2 … — PFMS Payee Code` (`3:7710`) | no name field | Name as per PFMS beside the payee code; SHRESHTA's desktop step body now uses this component | one source for the pattern and the form |
| NAPDDR instalment claims (12 screens) | "NGO PFMS code (under head 3817)" | "PFMS Unique (Payee) Code" | one code, one name (owner, via the cleanup session) |

The empty-state bank steps show only the re-entered account: the payee fields appear once the registration answer is
Yes, as in the build. The build followed in PRs #689 and #691. `check:figma-handoff -- --portal E-Anudaan --fresh
--strict`: all 15 pages conformant; the manifest did not change (no screen was added or removed).

**Later the same day.** Two further changes:

| What | Before | After | Why |
|---|---|---|---|
| NAPDDR new application, Step 7 — Beneficiaries, Bank & Grant | an empty step only, so NAPDDR's payee fields appeared only on its review, as "—" | a filled-in step beside it, desktop (`202:84300`) and phone (`202:85180`): registration answered Yes, with the name as per PFMS, payee code, confirming tick and EAT answer | NAPDDR now shows what AVYAY, SMILE and SHRESHTA already did |
| Yes/No questions on phone screens (98 questions, 35 screens across the four form pages) | drawn 540px wide inside a 277px column, so longer questions and hints were cut off at the right edge | each one fills its column, so the text wraps | "This account is registered on the PFMS DBT module" read "…on the PFMS DE" |

Two NAPDDR differences remain for the owner to decide in Figma; the build has both, and neither drawing does: the
**"Account is in the name of the NGO/VO"** question that opens Bank Account Details, and the **Grant Sought**
section (recurring, non-recurring and total grant) that the step's title promises. The manifest was re-captured for
the two new screens; all 15 pages are still conformant.

## 5g. Phone screens that cut off their content — 2 Oct 2026

The phone header was cut off on every phone screen. A survey of all 13 live pages then found more content hidden
on phone screens, in four ways. All were fixed in Figma; the build was not touched, and Old Screens was left alone.

| What | Before | After | Why |
|---|---|---|---|
| `Navbar/Portal` on phone screens (231 screens) | a fixed 412px in a 375px screen | fills the screen | the initials badge was cut off and only a corner of the BETA sash showed |
| `step bar` on NAPDDR phone steps (22) | fixed heights up to 842px around about 78px of content | hugs its content | large empty gaps above the step dots |
| Parts wider than their column (8) | scheme cards 720px; Yes/No questions 540px | fill the column | cut off at the right edge |
| Fixed-height rows and cards (about 140, mostly SMILE and SHRESHTA review rows, My Queue, CCTV) | content squeezed and clipped | hug their content | values, options and labels were hidden |
| `Form Step Content / SHRESHTA … Step 2 — Organisation Details` (`3:7883`) | three fixed 332px fields per row | fields fill the row (min 240, max 332) and rows wrap | the phone instance ran off the screen; desktop still lays out 3 × 332 |
| SHRESHTA Step 2 phone (`3:61389`) | a labelled 7-step `Stepper / Row` in 343px | the `step bar` (STEP 2 OF 7 plus dots) its sibling steps use | the labels overlapped |
| AVYAY phone `sticky action bar` (2 of 75) | absolutely positioned mid-screen | in the flow at the end of the screen, like the other 73 | it covered form fields |
| My Queue `Select / Filter` (9) | stretched to the label's 80px | hugs its value | "All years" wrapped over three lines |
| Inputs on phone (3) | a long value wrapped and was clipped | one line, ending in "…" | that is how an input behaves |
| Four fixed-height phone screens | content ran past the bottom | grow to their content | PFMS payee pattern, PFMS Set-Up Overview, Legacy Files, Sanction Pipeline |

Left as they are, for a decision:
- **Over 600 elements extend past a phone screen's right edge.** They are tab strips, document-row actions, card
  action buttons, the weekly-attendance day grid, CCTV area chips and breadcrumbs. Some, such as the tab strips,
  are probably meant to scroll sideways. Each needs a design decision, not a blanket fix.
- **8 texts on Officers · Paying a Sanctioned Grant (PFMS)** sit below a fixed-height `main` area that reads as a
  scrolling viewport; officers' PFMS screens are desktop-only.

The AVYAY 2nd Instalment Claim meta line (`3:51424`) was a text box fixed at 100px. It was fixed once the cleanup
session released the AVYAY, SMILE and SHRESHTA pages, and those three pages were then re-flowed around that
session's bank-step fixes.

The 13 pages were re-flowed for the new heights. The journey order did not change, and user groups stay stacked
top to bottom, as §10a requires. `check:figma-handoff -- --portal E-Anudaan --strict --fresh`: 15/15 conformant.
The manifest did not change.

## 5h. The PFMS screens redrawn after the division's review — 3 Oct 2026

The Programme Division reviewed the first PFMS draft (§5b–§5f) and shared its own verified prototype. Its feedback
was that there were too many fields and the flow was confusing. After a design-director audit of the draft, the
prototype and the NeGD BRD, the PFMS screens were redrawn: the prototype's structure, our BRD coverage, and the
SAMAVESH visual language unchanged. The audit, the gap register and the reply to the division are published
separately as *PFMS Design Direction*.

| What | Before | After | Why |
|---|---|---|---|
| Pages | Two pages: Paying a Sanctioned Grant (PFMS) with 61 drawings, and PFMS Set-Up with 20 | One page, **Officers · Paying Grants through PFMS**, with 21 screens. The set-up page is renamed **Officers · PFMS Set-Up (Moved)** and holds only a note | One place for the whole payment leg; the Bureau's set-up is part of it |
| User groups | Programme Division Maker and Checker; Bureau | PD Maker; PD Checker; Bureau, each with its own side menu | The division's design: one login, and the role decides what an officer sees |
| Payment advice | A five-step wizard plus seven error versions | **One page** in six sections (Sanction · Where the Bill Lands · Head of Account · Beneficiary · Supporting Documents · Summary) and four states: Fresh Case, With Errors, Returned by PFMS, With the Checker | Three choices and four documents do not need five steps. This departs from BRD §6.5 (wizard), so it needs NeGD's acceptance |
| Fields on the advice | About 40 items, each BRD field on its own row | Read-only facts in compact lines. Fixed codes are one line. Deductions and Not Payable Before are under More Options. Payee remarks are filled in. Documents show what is needed now and what is needed later | Show what the officer decides; fold away what the system knows |
| Maker queue | Six tabs | One list with a Case column (Fresh, Draft, Returned by the Checker, Not Accepted by PFMS), and an empty state | One place to look |
| Checker | A full repeat of the form and eight signing pop-ups | Queue and empty state; Authorise and Sign with the original sanction order beside a one-card summary and the officer's DSC; states Cannot Sign, Returning to the Maker (reason box) and DSC Not Found | Compare, then sign; failures shown in place |
| Following a payment | Ten status screens and an eight-stage tracker | One screen with six plain stages (Sent to PFMS · With the DDO · At the PAO · At the Bank · Credited · Closed), Release Reconciliation and Payment to the NGO (UTR); states In Progress, Credited and Stopped | Every situation is a state of one screen |
| Set-up | Eight Bureau screens and five legacy-file screens | PFMS Masters (with an Out of Date state), Schemes and Checkers (heads and code per scheme, plus the designated Checker per DDO), Older Files (and None Waiting) | The BRD gives these to the Bureau (§4, FR-HOA-002, BR-DSC-001, BR-BAK-001); the prototype had no owner for them |
| Dashboard | Sanction Pipeline, inside Payment Reports | **Dashboard** as the first menu item, with the BRD §11 reports as its tabs | The division's starting point, without losing the BRD reports |
| Old screens | — | All 81 drawings, journeys intact, moved to **Old Screens — Do Not Use** under *Replaced Screens — 3 Oct 2026 · PFMS First Draft*, at 40% | Kept for reference; moving within the file keeps every node id |
| Links | Start Here's Portal Map and the guides pointed at the old screens | All 61 links re-pointed to the new screens, with labels and the page guides rewritten | No link lands on an archived screen |
| Phone versions | 13 officer phone screens | None drawn | Officers' PFMS screens are desktop only (decided 1 Oct) |

The library's `Select` has no read-only state. The locked advice therefore shows the chosen values in the normal
style, with a banner, and the missing read-only state is recorded as a gap for SAMAVESH. The BRD checklist
(`docs/plans/2026-10-01-e-anudaan-pfms-requirements-checklist.md`) still links the archived screens, and is
re-pointed in a follow-up. `check:figma-handoff -- --portal E-Anudaan --strict --fresh`: 15/15 conformant. The
manifest was re-captured; it changed only on the three pages above.

## 6. Adding to the page

- **A screen:** into the right row of its flow; name `Role / Screen / State`; phone version ends ` · Mobile`.
- **A flow:** a free number in its role (`NGO 145`), then run the layout from `layout-engine.js`
  and regenerate the Portal Map and Status.
- **A role:** a new column in B, in lifecycle order; flows numbered from 10 with a new role code.
- **Then:** `npm run check:figma-handoff -- --portal E-Anudaan --fresh --strict`, and refresh the snapshot.
