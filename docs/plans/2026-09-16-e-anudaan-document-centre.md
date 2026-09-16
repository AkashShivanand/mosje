# e-Anudaan — the Document Centre (upload, automatic check, history)

**Branch:** `feat/e-anudaan-portal-completion` · **Date:** 16 Sep 2026
**Replaces:** the Upload Documents step's `DocumentsChecklist` (one tall card per document), the
deficiency "Replace File" block and the officer's document list.

## 1. What the live portal does (evidence, not memory)

Read from `tools/design-audit/projects/e-anudaan/captures/live/*DOCUMENT-UPLOADS*` (AVYAY new and
renewal, NAPDDR new and renewal, SHRESHTA Mode 2) and the officer `*-DECISION` captures, plus the
two reference screenshots the user attached on 16 Sep.

| Live behaviour | Observed as |
|---|---|
| Accepted types and size stated per scheme | "PDF · Max 5 MB per file · All mandatory." (AVYAY) · "PDF / JPG / PNG · Max 5 MB per file" (NAPDDR) |
| Count | "11 / 11 uploaded", "10 / 17 uploaded" with a progress bar |
| Batch upload that places files in slots | "Batch upload all documents — Drop all your files here — they will be automatically identified and placed in the correct document slots below. Up to 17 files" |
| Grouping (SHRESHTA) | Registration & Identity · Reports & Beneficiary Records · Financial · Banking & Legal · Compliance & Operations · Supporting |
| Per-slot actions | View · Replace · Re-verify (and "Upload file" when empty) |
| Upload failure | "Upload failed. RETRY" under the title |
| Automatic check, five outcomes | "Verifying…" · "✓ Document verified — <type>" + "Verified · 100%" · "⚠ Needs review — <type>" + "Needs review · 75%" · "✗ Document not valid — <type>" + "Not valid · 95%" · "ⓘ Automatic check unavailable — We could not check this document automatically. Your upload is saved and a reviewer will verify it by hand — you do not need to do anything." + "Not verified" |
| What a verdict carries | a one-line headline, a summary sentence, 1–3 reasons ("The IFSC code is not present in the document."), extracted fields (Organisation Name, Registration Date, Registration Number, Financial Year, Total Budget, IFSC, Account Name …), a confidence % against a 90% bar ("Automatic verification confidence is 75% (needs 90%). A reviewer will confirm this document.") |
| Gate at the step | Next disabled; beside it: "'Budget Estimates – Current Year' is not valid. Replace it — or use Re-verify if you believe the check is wrong — before continuing." / "2 documents are not valid. Replace them — or use Re-verify …" |
| Conditional documents | "Required when the institution already receives GIA", "Required when the institution building is rented", OPTIONAL tag |
| Officer side | "Documents (N uploaded of M on the checklist)"; "Annual documents · verified & remarked each year"; "Permanent documents · one-time — view-only unless re-uploaded this year"; "This year's document · uploaded dd/mm/yyyy"; "Officer Supporting Documents (n)" with "Document title (optional)" + "Upload PDF/JPG/PNG"; "Attach a file (optional) — attached to your forward, deficiency, or in-file query"; "Generate Review Report" |

What the **11 Sep call** added (transcript lines):

- **T83–92** — a replaced document must keep every earlier version: "a log of the file", as many
  versions as there are replacements.
- **T213–232** — multiple files can be dropped at once and sorted into their type automatically,
  instead of asking the user to pick a type for each (employees' certificates included).
- **T676–679** — the review step lets the applicant open what they uploaded.
- **T680–686** — the vendor shares passing and failing sample documents so every edge case is tested.
- **T752–771** — the officer's remark rules per verdict, and "the AI report stays at the side" of the
  officer's review, then an overall remark and forward.

## 2. What is wrong with the live step — read as the NGO clerk uploading 17 files

1. **Everything is the same height and the same volume.** A verified file and a rejected one take the
   same tall card; on AVYAY the step is 4,953px. The one document that needs action is found by
   scrolling past ten that do not.
2. **Four pills per row compete** — "Uploaded", "Verified · 100%", "MANDATORY", a check glyph. Two of
   them say the same thing, and "Uploaded" is shown next to "Not valid".
3. **A percentage is not an instruction.** "Needs review · 75%" does not tell the clerk whether to act.
   The only threshold that matters (90%) is hidden in a sentence.
4. **"Automatic check unavailable" looks like an error** (grey box, ⓘ, "Not verified") while it asks
   nothing of the user.
5. **"Upload failed. RETRY"** is 12px red text under the title — the most urgent state is the quietest.
6. **Batch upload places files silently.** Nothing says which file went where, what it could not
   place, or what it overwrote.
7. **The gate is a disabled button** with the reason in small text beside it; a keyboard or screen
   reader user finds a dead button.
8. **Replace destroys history** (the call's T83 complaint).

## 3. The design

### 3.1 One header that answers "what do I have to do?"

```
Upload Documents                                                  PDF, JPG or PNG · up to 5 MB each
[■■■■■■■■■■■■■■■□□□□□]  12 of 17 required documents ready
( Needs your attention 3 )  ( Being checked 2 )  ( Ready 12 )  ( Optional 1 )     ← filter chips
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ ⤒  Drop all your documents here, or Choose Files                                           │
│    We read each file and put it in the right place. You can move any we get wrong.         │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Progress counts "ready", not "uploaded".** A rejected upload is not progress.
- **Three chips are the three questions** a clerk has, and each filters the list. "Needs your
  attention" = not valid + upload failed + required and missing + **check was unsure** (amended
  16 Sep 2026, §6.1 item 11). Checking and "couldn't check" are not in it, because neither asks
  anything of the user.
- **"Asks something of me" and "stops me" are different questions.** A chip answers the first; the
  gate (§3.5) answers the second. A row the check was unsure about is in Needs your attention and
  blocks nothing, exactly as a file still being checked is not Ready and blocks nothing.
- The accepted types and size are stated once, where the file is chosen, not under every row.

### 3.2 One compact row per document, grouped as the scheme groups them

```
● Registration Certificate *                          registration-cert.pdf · 812 KB · 14 Sep   Looks right      [ ⋯ ]
▲ Budget Estimates — Current Year *                   budget-2026-27.pdf · 6 KB             Doesn't match    [Replace]
    Only the cover sheet was found — the head-wise estimates are missing.        What we found ▾   Check Again
○ List of Managing Committee Members *                —                                        Not uploaded     [Upload]
✕ Agreement Bond / PSR on Stamp Paper *               bond.pdf                               Upload failed    [Try Again]
◌ Audited Accounts *                                  audited-accounts.pdf · 2.1 MB          Checking…
```

- **Height follows need.** A row is one line (56px) unless the document needs attention, when the
  reason shows beneath it (one sentence, the model's first reason). Everything else — extracted fields,
  all reasons, preview, history — sits behind "What we found" and the row menu.
- **One status, in words, with a distinct icon and colour** (never colour alone):

| State | Words on the row | Icon | Blocks Continue? | Primary action |
|---|---|---|---|---|
| Missing (required) | Not uploaded | ○ outline | yes | Upload |
| Missing (optional) | Optional | — | no | Upload |
| Uploading | Uploading 64% (bar) | spinner | — | Cancel |
| Upload failed | Upload failed — check your connection | ✕ error | yes | Try Again |
| Rejected before upload | This file is 7.2 MB. The limit is 5 MB. / Only PDF, JPG or PNG files can be uploaded. | ✕ error | yes | Choose Another File |
| Checking | Checking… | ◌ progress | no* | — |
| Verified | Looks right | ● success | no | (menu) |
| Needs review (< 90%) | Check the details — (first reason) | ▲ warning | no | What we found |
| Not valid | Doesn't match — (first reason) | ▲ error | yes | Replace |
| Check unavailable | Saved — an officer will check it | ⓘ neutral | no | (menu) |

\* A file still being checked does not stop the applicant moving on; Submit waits for it.

- **Confidence leaves the applicant's screen** and stays on the officer's. The applicant needs the
  consequence ("Check the details" vs "Doesn't match"), which the 90% bar already decides.
- **"Re-verify" becomes "Check Again"** — the same action, in words a clerk uses.
- **"What we found"** expands in place: the model's extracted fields as a two-column list, **each
  compared with what the application says** — "Organisation Name: HARIJAN SEVAK SANGH ≠ Sankalp Seva
  Sansthan on your application" — then all reasons. A mismatch with the applicant's own answers is the
  single most useful thing the check produces; the live portal shows the value and leaves the
  comparison to the reader.
- **Row menu (⋯):** View · Replace · Check Again · Upload History · Remove (optional documents only).

### 3.3 Batch upload that shows its work

Dropping files never replaces a document silently. After a drop, a **placement tray** appears above the
list until the user closes it:

```
We placed 7 of 9 files.                                                             [Done]
  budget-estimates.pdf   →  Budget Estimates — Current Year        Change ▾
  scan0043.pdf           →  We couldn't tell what this is.         Choose a document ▾   Remove
  annual-report-old.pdf  →  Annual Report — Previous FY  (replaces annual_2025.pdf)   Keep Both? No — the old one moves to history
```

- Files the reader could not place are **listed, never dropped**; each gets a "Choose a document"
  select that lists empty slots first.
- A drop onto a slot that already has a file says so ("replaces …") and the earlier file goes to that
  document's history — nothing is lost (T83).
- Every placement can be changed in one click; placement is by the check's detected type.

### 3.4 History for every document type (T83–92)

"Upload History" opens a side sheet for that document:

```
Budget Estimates — Current Year
  Current   budget-2026-27-v3.pdf   16 Sep 2026, 11:42   Looks right            View
  Earlier   budget-2026-27-v2.pdf   16 Sep 2026, 11:30   Doesn't match          View
  Earlier   budget-2026-27.pdf      14 Sep 2026, 17:02   Upload replaced after the Ministry's query   View
```

The same log is what the officer and the deficiency flow read, so "what did they send before" has one
answer everywhere.

### 3.5 The gate

- **Continue stays enabled.** Pressed with blockers, the page shows an `ErrorSummary` at the top
  ("3 documents need your attention before you continue"), each item a link to its row, the list
  filters to "Needs your attention", and focus moves to the summary. A disabled button explains nothing
  and cannot be focused.
- **Submit** (Review step) is the hard gate: no required document missing, failed, not valid or still
  checking.

### 3.6 The same component in four places

| Where | Mode |
|---|---|
| Wizard · Upload Documents | editable, grouped, batch drop, gate |
| Wizard · Review & Submit | read-only rows, View, status; "Edit" returns to the step |
| Deficiency · Resolve | only the queried documents, with the Ministry's remark above each row; Replace keeps history |
| Officer · Review | read-only rows with **automatic check + confidence** as advice beside the officer's own verdict (Not reviewed / Verified / Needs Correction, remark rules O5), grouped **Annual documents / Permanent documents** as live does, plus **Officer Supporting Documents** upload |

## 4. Pressure test — as the design director

| Challenge | Answer |
|---|---|
| "Hiding the percentage hides information the NGO may want." | The percentage changes nothing the NGO can do; the threshold does. It stays for officers, who weigh it. If the Ministry wants it shown, it goes inside "What we found", not on the row. |
| "Compact rows make a rejected document easy to miss." | Rejected rows grow, carry the red icon and the reason, sort to the top of their group, count in the header chip, and the gate lists them. The quiet rows are only the ones that need nothing. |
| "Auto-placement will put files in the wrong slot." | That is why the tray exists: every placement is shown and changeable, uncertain files are listed not guessed, and a replacement keeps the earlier file. The live portal already auto-places without showing it. |
| "An enabled Continue lets people skip." | It lets people *learn why* they cannot. The step still refuses; Submit is the hard gate. GOV.UK and USWDS both keep submit buttons enabled for this reason. |
| "Checking takes long; people will wait on the step." | Checking never blocks Continue; the row updates when the verdict arrives; the Review step and Submit hold the line. A polite live region announces "Budget Estimates: looks right". |
| "The model is wrong sometimes — Doesn't match blocks a genuine file." | "Check Again" stays (live parity). A way to keep a rejected file with an explanation for the officer is **not** added: it changes the Ministry's rule and is listed in §6 for decision. |
| "On a phone, a 17-row list with menus is hard." | Rows stack (title, status, action on its own line); the tray and history become full-screen sheets; "Choose Files" opens the camera or files. |
| "Screen readers." | Status is text; icons are decorative; the tray is a list with labelled selects; verdict changes use `aria-live="polite"`, failures `assertive`; the ErrorSummary takes focus. |

## 5. What is removed, and why

| Removed | Why |
|---|---|
| "Uploaded" pill beside every verdict | Duplicates the file name and contradicts a "Not valid" verdict |
| "MANDATORY" pill on every row | A red `*` after the title says it, as on every other field; only "Optional" is marked |
| Per-row "PDF · max 5 MB" repeats | Stated once, where files are chosen |
| Confidence % on the applicant's screen | Kept for officers (§4) |
| "Tip: Upload all documents at once using the batch uploader above" | The drop zone says what it does |
| Verified rows' full extracted-field panel open by default | Behind "What we found"; it answers nothing the row does not |

## 6. For decision (not built)

1. Let an applicant keep a document the check calls "not valid", with a written explanation for the
   officer. (Live: must replace or Check Again.)
2. Show the confidence percentage to applicants inside "What we found".
3. Whether a document uploaded last year counts as "Permanent" (view-only unless re-uploaded) for
   AVYAY and NAPDDR, as SHRESHTA's officer screen shows.

### 6.1 Where the build deviates from this spec, and why (16 Sep 2026)

1. **An upload in flight holds Continue.** §3.2's table leaves it "—". Leaving the step mid-upload
   unmounts the upload and loses the file, so Continue waits and says "Wait for … to finish
   uploading" — listed in the ErrorSummary only when nothing else stops the applicant, so every
   link lands on a row the filter is showing.
2. **"Check Again" cannot turn a verdict round.** The serious audit (UX-07 / S08) removed Re-verify
   because it let an applicant turn "not valid" into "Verified" on the same file. The prototype's
   check is a function of the file, so Check Again on the same file gives the same verdict; only
   "check unavailable" can clear on a second run. Live parity for the control, not for the loophole.
3. **Attention rows sort to the top from a snapshot**, refreshed when the step opens, files are
   dropped, a filter is chosen or Continue is pressed — never when a verdict arrives. Re-sorting on
   every verdict moved the row being worked on out from under the pointer.
4. **Required "Upload" is outlined, not filled.** On a first visit every row is missing; seventeen
   filled buttons left nothing to lead the eye. Filled is kept for what went wrong.
5. **Rows are numbered as drawn, group by group.** SHRESHTA's groups put document 15 between 9 and
   18, and a column of numbers out of order read as a mistake. Identity is still the schema's `n`.
6. **The tray folds plainly placed files** past four lines behind "Show N More Placed Files", with
   unplaced, refused and replacing lines first. A 17-file drop otherwise pushed the checklist a
   screen and a half down.
7. **Groups.** SHRESHTA Mode 2 keeps the live portal's six groups; a document none of them names is
   placed by topic (an "Audit Report" with Financial), and only failing that under Supporting.
   AVYAY, NAPDDR and SMILE have no live groups, so they are split into Required and Optional.
8. **Comparison rules.** Another organisation's name or registration number, or the wrong financial
   year, makes a document "Doesn't match"; an IFSC or account number that differs from the
   application makes it "Check the details", because the account on the application can itself be wrong.
9. **The officer's automatic check on seeded files is computed when the screen is drawn**, not
   stored: the seed deliberately carries no verdicts to keep the store inside localStorage
   (serious audit S03). Files uploaded through the form keep the verdict recorded at upload.
10. **Submitted applications do not yet carry the wizard's upload history.** `documentsOf` in
    `submission.ts` (not this change's file) copies the file and verdict but not `UploadedDoc.history`.
    Replacements made after submission (the correction flow) are kept. Hook needed:
    `versions: up.history?.map(h => ({ fileName: h.fileName, sizeKb: h.sizeKb, uploadedAt: h.uploadedAt, replacedAt: h.replacedAt, verdict: h.verdict }))`.
11. **A file the check was unsure about is not Ready (design-director audit D-01, 16 Sep 2026).**
    As first built, the row read "Please confirm" in amber while the header said "10 of 10 required
    documents ready", the bar was green, the Ready chip counted it — and the row offered nothing to
    confirm with. One of those answers was wrong.
    *Options weighed.* (a) Rename it to something settled — "Accepted — an officer will check" — and
    keep it Ready. (b) Keep what the row asks, and take it out of Ready.
    *Decided: (b).* The unsure verdict carries information the applicant can act on — most often an
    IFSC or account number that differs from the application (item 8), where either the file or the
    application is wrong and only the applicant knows which. Calling that "Accepted" would hide the
    one useful thing the check found. So:
    - the words are **"Check the details"**, not "Please confirm" — they point at the reason line and
      "What we found", which are on the row, instead of at a confirm action that is not;
    - `DOC_STATE_META.review.bucket` is **`attention`**: counted under Needs your attention, never in
      "N of M required documents ready", never in the Ready chip;
    - it **blocks neither Continue nor Submit** — an officer decides the document, as §3.2 always said.
    The header, the chips and both gates read `summariseDocuments`, so they agree by construction;
    `glossary.test.ts` asserts it. The word is glossary-owned (`AUTO_CHECK.applicant.review`,
    docs/plans/2026-09-16-e-anudaan-glossary.md).
