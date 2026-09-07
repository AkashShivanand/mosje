# Live findings during the 2026-09-07 re-clone run
(scratch — folded into the change report and tracker at the end)

## F1 — NAPDDR step 1 DOES carry a Case Type radio
`e-anudaan-build-defects.md` closes with: *"Still to confirm against live: … whether
NAPDDR's step 1 forks (live shows a Case Type radio our schema does not model at all)."*

**Confirmed live, 2026-09-07 10:09.** The driver set it:

    [flow napddr-new] submission ALLOWED — dev/uat and the flow opted in
        · set 'Case Type' = 'New project' (radio)
      ok NGO-NAPDDR-NEW-S01-APPLICATION-TYPE-ARRIVED: 70 rows

So NAPDDR's step 1 is titled "Application Type" and forks on a Case Type radio. Our schema
models NAPDDR's step 1 with `fld_application_type` and `fld_scheme_category`, and has no
`case_type` for NAPDDR at all — AVYAY and SMILE have one, NAPDDR does not. Whether the
fork changes NAPDDR's step or document count is what the completed walk will show.

**Action:** compare `NGO-NAPDDR-NEW-*` against `NGO-NAPDDR-RENEWAL-*` once both land. If
the counts differ, NAPDDR needs the same `showWhen` treatment D1 gave AVYAY.

## F2 — the branch controller works
First successful flip of a branch controller since the capability landed in `33ca6576`
and `2f61f797` on 2026-09-03. Every wizard state in the corpus before today was the
renewal path.

## F3 — the first forward label never resolves on this portal (log noise, not a defect)
`FORWARD_LABELS = ("Save & Next", "Next", "Continue", "Proceed")` — this portal labels the
control **"Next"**, so every wizard step logs

    ! could not click 'Save & Next' (no button resolved) — step skipped

and then advances on the second label. Harmless to the capture, but it puts a failure line
above every successful step, which is exactly the shape a real failure takes. Worth a
`forward: [Next]` override on the wizard flows after this run — NOT during it.

Second-order note: "Save & Next" matches the engine's DESTRUCTIVE pattern on `save`. On the
gate-shut flows it is skipped by the guard rather than by failing to resolve, so the same
step produces a *differently worded* line depending on the gate. Both mean "we used the
next label"; neither means the walk is in trouble.

## F4 — engine tests could not be run on this machine
`pytest` is not installed for any python3 on this host, so the engine's suite (124 tests as
of the tracker) was not exercised. No engine CODE was changed by this pass — the edits are a
YAML manifest and a binary fixture — so the suite is not implicated, but this should be said
out loud rather than left as an implied green.

## F5 — BLOCKER, and the tracker's diagnosis of it was wrong

The tracker says of the stuck upload step: *"The fix is a real PDF, not a code change."*
That is half right and the wrong half is load-bearing.

**What the portal actually does.** It reads the CONTENT of each uploaded document and
rejects placeholders by name. From `NGO-NAPDDR-NEW-S09-DOCUMENT-UPLOADS-FILLED`, the
portal's own words:

> The uploaded file contains only test text ('DESIGN QC DRY RUN') and no genuine d…
> This appears to be a test or placeholder file. Please upload the actual supporti…
> Placeholder/test document rejected; please upload the actual supporting document
> **12 documents are not valid. Replace them — or use Re-verify if you believe the c…**

It even quotes the string out of the old 416-byte fixture. This is not a size or
well-formedness gate. It is a substantive-content gate, and it is working correctly.

**Two consequences.**

1. **The new fixture was never even tried.** `12/12 already uploaded — leaving them alone`
   — engine defect-fix #7 deliberately skips a complete upload set, so the replacement PDF
   never reached the portal. The set is *complete* and *invalid* at the same time, and the
   engine has no notion of that state. It reads `status[0] >= status[1] > 0` and stops.
   **Engine gap:** when the page reports documents invalid, a complete set must be
   replaced, not preserved. The page says so in a countable sentence.

2. **A replacement fixture cannot honestly clear this gate.** The new fixture is itself
   headed "Test Fixture — Not a Genuine Document" and would be rejected on exactly the
   same grounds. Getting past the check means producing documents that read as genuine
   supporting evidence for a grant application — a fabricated registration certificate,
   fabricated audited accounts. That is manufacturing records to defeat a verification
   control on a government system, and it is not something to do to tick off a capture.
   The portal's "Re-verify … if you believe the check is wrong" is not a way round it
   either: the check is right.

**This is a human step.** Genuine sample documents have to come from the department or the
vendor, as a sanctioned test data set. Recorded rather than worked around.

**What was NOT lost.** The walk captured **18 states** for NAPDDR's new-project branch —
S01 to S09, arrived and filled — against 2 in the previous corpus. Everything short of
Review & Submit is now held for a branch that had never been walked at all.

## F6 — the placeholder check is a parity finding for our own clone
Our build's upload step has no content verification of any kind. The live portal rejects a
document that is structurally valid but substantively empty, and tells the applicant which
of the twelve failed and why, in plain language. That behaviour is not in
`form-schema.ts` or `grant-wizard.tsx` and is not in the build-defects list. It should be.

## F7 — THE CHANGE. Document verification was off in August; it is on now

This is the answer to "has anything changed since we last cloned it", and no fingerprint
check could have found it. **Both UAT builds are byte-identical to 2026-09-03** — and the
portal behaves differently anyway, because the change is in a verification service, not in
the bundle.

**August (`docs/audit_screenshots/e-anudaan/ngo/02_avyay/`, captured 2026-09-02).** Each
document sits as `Uploaded` / `Not verified`, above the portal's own explanation:

> **Automatic check unavailable** — We could not check this document automatically. Your
> upload is saved and a reviewer will verify it by hand — you do not need to do anything.
> You can use Re-verify if you would like to try the automatic check again.

The uploads were ~1 KB each (`audit_document_3.pdf · 1 KB`) and were **accepted**.

**Today.** The same step, same build, reads the content and refuses:

> 12 documents are not valid. Replace them — or use Re-verify if you believe the check is wrong
> The uploaded file contains only test text ('DESIGN QC DRY RUN') and no genuine d…

So the automatic document check has been **switched on, or repaired, between 2 September
and today**. In August a placeholder passed to a human reviewer; now it is rejected at the
gate with a per-document reason.

This is a behaviour change on a live government service that a build-fingerprint diff, a
screenshot diff of the nav routes, and a structure-hash diff would all have missed — the
step only reveals it once a document is actually uploaded.

## F8 — the August archive does NOT contain a post-submission screen for any scheme
The plan to reuse last month's confirmation screens cannot work, because they were never
captured. In all four schemes `Step_Final_Confirmation.png` is **byte-identical** to that
scheme's `Step_NN_Review_And_Submit.png` — the same file saved twice under two names.

| Scheme | What the file called "Final Confirmation" actually shows |
|---|---|
| NAPDDR | The **Review & Submit** page — genuine, with Edit links and read-only values |
| AVYAY | **Document Uploads** — uploaded, "Not verified", automatic check unavailable |
| SHRESHTA M2 | **Document Uploads** — `0 / 7 uploaded`, Next disabled |
| SMILE / Garima Greh | An **Organisation Details** form step, textareas still being filled |

So of eight files asserting review-or-confirmation coverage, **one** is a review page and
**none** is a post-submission acknowledgement. The naming asserted coverage that the
pixels do not support, which is presumably how the belief that we held these arose.

**What we do have that August did not:** NAPDDR new-project S01–S09 and renewal S01–S10,
arrived and filled — 38 states across the two branches, from a portal August never got
past step 5 on for three of the four schemes.

## F9 — SHRESHTA M2's document count, from the August capture
`Step 5 of 6 — Document Uploads`, `0 / 7 uploaded`, ten items listed, three marked
OPTIONAL, and the footer reads `Upload all 7 documents to proceed (0/10)`. Seven mandatory
of ten listed. The build-defects note says our source declares 20 documents for
SHRESHTA_M2 and the deployed build counts 7 — this pins the live number at **7 mandatory,
10 listed**, and shows the vendor's own footer mixing the two counts in one sentence.

## F10 — NAPDDR forks, and our schema does not model the fork at all (answers the open question)

`e-anudaan-build-defects.md` closes: *"Still to confirm against live … whether NAPDDR's
step 1 forks (live shows a Case Type radio our schema does not model at all)."*

**It forks. Both branches are now captured, and they differ by more than a field.**

| | New project | Renewal |
|---|---|---|
| Total steps | **10** | **11** |
| Document Uploads at | step 9 | step 10 |
| Documents on that step | **12** | **8** |
| `CCTV, EAT & PFMS Compliance` | **absent** | **present, step 8** |

Step by step, from the captures:

| # | NEW | RENEWAL |
|---|---|---|
| 1 | Application Type (4 fields) | Application Type (5) |
| 2 | Organisation Details (16) | Organisation Details (16) |
| 3 | Project Details (12) | Project Details (9) |
| 4 | Location, Infrastructure & Preparedness (29) | Location, Infrastructure & Preparedness (27) |
| 5 | Functionaries, Staff & Committee (5) | Functionaries, Staff & Committee (4) |
| 6 | Capability & Prior Work (9) | Capability & Prior Work (4) |
| 7 | Beneficiaries, Bank & Grant (13) | Beneficiaries, Bank & Grant (15) |
| 8 | Verification & Declaration (10) | **CCTV, EAT & PFMS Compliance (5)** |
| 9 | **Document Uploads (12 docs)** | Verification & Declaration (10) |
| 10 | Review & Submit | **Document Uploads (8 docs)** |
| 11 | — | Review & Submit |

The extra renewal step reads correctly: CCTV, EAT and PFMS compliance is reporting on a
grant already running, so a first-time applicant has nothing to report.

**Against our build.** `form-schema.ts` gives NAPDDR `fld_application_type` and
`fld_scheme_category` on step 1 and **no `case_type`**, so there is no controller to fork
on and every applicant gets one fixed list of steps and one fixed list of documents. This
is the same defect class as D1 (AVYAY) but on a scheme where it was never even suspected,
and it now has measured numbers behind it rather than an inference.

**Also note the field counts differ on shared steps** — Project Details 12 vs 9, Capability
& Prior Work 9 vs 4, Beneficiaries 13 vs 15. So the fork governs conditional FIELDS inside
shared steps as well as the step list. `fieldVisible()` exists in our schema and could
carry these once `case_type` is modelled.

## F11 — AVYAY's new branch does have a Justification step
Captured at S04 with 3 fields, confirming the requirement transcribed in `form-schema.ts`
("NEW branch has 8 steps"). D1 recorded the deployed UAT build as showing 7 steps for new
projects; the branch walked today shows Justification present on the new path. The walk
stopped there — the forward control would not advance — so the steps beyond it on the new
branch are still uncaptured.

## F12 — the officer decision screen, captured for the first time

`AVYAY-PD-ASO-DECISION`, 249 rows, at
`https://eanudaan-admin-uat.mosje.in/dashboard/avyay/aso/review/83911`.

**That route is in no role's navigable route list.** The crawler could never have reached
it — it exists only behind a table row, which is exactly why 25 roles' worth of navigation
crawling since August produced 24 worklists and zero decision screens.

The screen is not a detail view. It is the sanctioning desk, and it carries eleven
sections the corpus had no example of:

| Section | |
|---|---|
| `ASO-PD Review — GIA/2026-27/AVYAY/…/83911` | h1, carries the case identifier |
| Applicant · Application Details | the case |
| **Grant — Recurring vs Non-Recurring** | with a Recurring / Non-Recurring toggle |
| **Component-wise Cost Sheet** | with "Open sheet" |
| **Previously Allocated Funds — this NGO** | prior-grant history |
| **Sanction & Disbursement — this Project** | money actually released |
| **Show Cause Notices** | enforcement history |
| Documents (3 uploaded of 3 on the checklist) | |
| Officer Supporting Documents (0) | officer's own attachments |
| **Audit Trail** | |
| **Your Action** | the decision itself |

The only decision control on this grade is **"Forward to SO"** — so the action set is
grade-specific, and capturing all five grades of both ladders in both schemes is not
over-collection, it is the only way to see what each rank may actually do.

**The gate held.** `submission BLOCKED — allowSubmit is False, not True` is logged
immediately above the capture, and `Forward to SO` matches the engine's DESTRUCTIVE
pattern on `forward`, so it was photographed and never pressed.

**Implication for our build.** `apps/hub/src/app/portals/e-anudaan/(console)/dashboard/
sm2/[key]/review/[appId]/page.tsx` exists, so we have *a* review page — but nothing in the
corpus until now showed what the live one contains. Cost sheet, previously-allocated
funds, sanction & disbursement and show-cause notices are four sections whose presence in
our build has never been checked against anything.
