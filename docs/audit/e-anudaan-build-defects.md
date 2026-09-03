# e-Anudaan — defects in OUR build

**Status:** D1, D2, D4, D5, D6, D7 **fixed** on `fix/eanudaan-live-parity`; D3 **withdrawn**
against live evidence. e-Anudaan tests 33 → 38, capture-engine tests 80 → 124.
**Still to confirm against live:** the exact labels of AVYAY's two renewal-only project types, and
whether NAPDDR's step 1 forks (live shows a Case Type radio our schema does not model at all).
**Raised:** 2026-09-03 · **Source:** `apps/hub/src/lib/e-anudaan/form-schema.ts`,
`apps/hub/src/components/e-anudaan/grant-wizard.tsx`
**Distinct from** `e-anudaan-uat-design-audit.md`, which judges the *rendered* portal against
design standards. This file lists defects in the code we wrote, found by comparing the schema
against its own transcribed requirement.

> **Why these were missed.** The design audit judged the running portal against WCAG, GIGW and
> this estate's own rules. It never compared the portal against **the requirement transcribed from
> the live vendor site**, which has been sitting in this repo the whole time — in the header of
> `form-schema.ts` and in `docs/research/eanudaan-user-dev.mosje.in/INVENTORY.md`. A rendering that
> is accessible, consistent and well-worded can still ask the wrong applicant the wrong question.
> Reported by the user, not found by the audit.

---

## The root cause behind the first three

**`StepDef` cannot vary by branch.** `FieldDef` has `showWhen` and `DocDef` has `showWhen` —
`StepDef` does not, and there is no `visibleSteps()` beside `fieldVisible()` and
`visibleDocuments()`. `grant-wizard.tsx:148` reads `const total = def.steps.length`, so **every
step renders on every branch.**

The requirement, in the file's own header: *"AVYAY 8/7 steps … NEW branch has 8 steps and 11
documents; renewal 7 and 9."* Documents honour it. Steps cannot.

---

## D1 🔴 ✅ FIXED — AVYAY renders the same number of steps on both branches

| | New project | Renewal |
|---|---|---|
| Required | 8 steps | 7 steps |
| Current source | 8 | **8** ✗ |
| Deployed UAT build | **7** ✗ | 7 |

Whichever count is hard-coded, one branch is wrong. Today's source gives a renewal applicant a
**Justification** step that applies only to new projects; the deployed build omits Justification
from new projects, where it is required.

**Fix:** add `showWhen` to `StepDef`, add `visibleSteps(wizard, values)` beside the two helpers
that already exist, and have `grant-wizard.tsx` count and index against that list rather than
`def.steps`. Note the indices at `grant-wizard.tsx:143-147` (`docsIndex`, `reviewIndex`,
`activeIndex`) all address `def.steps` and must move with it.

## D2 🔴 ✅ FIXED — A new-project applicant is forced to pick an installment number

`fld_installment_no` is `required: true` with **no `showWhen`**, so it renders on both branches.
Its own help text is renewal-only: *"Which installment of the selected financial year's **recurring
grant** this application releases. The next un-submitted installment **for that year** is
preselected; ones already submitted for the same year are marked."*

A first-time applicant has no recurring grant and no prior installments, and cannot proceed without
answering. **The field directly above it, `fld_ongoing_source_application`, carries exactly the
right `showWhen`** — so the pattern was understood and applied to one field and not its neighbour.

```ts
// form-schema.ts:380 — add:
showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] },
```

> **This was already visible and I misread it.** The design audit recorded the validation message
> *"Installment is required."* as finding **m3, a copywriting problem**. It is not a wording
> problem. It is this defect, blocking the new-project branch, and m3 should be re-filed.

## D3 ⚪ WITHDRAWN — SHRESHTA_M2 asks a first-time institution when its grant began

Raised on the strength of the help text alone. **Checked against live and withdrawn:** the vendor's
portal shows `fld_gia_since_year` — *"Year from GIA received under SHRESHTA \*"* — on step 2 to
everyone, asterisked. Our clone matches it exactly.

Our help text, *"Applies to ongoing institutions,"* is ours and is the only thing wrong here: it
tells an applicant a rule the form does not apply. Either the sentence goes, or it becomes
guidance a first-time applicant can act on. **Raise the underlying question with the vendor**; do
not diverge from live to fix it.

> Kept rather than deleted because a withdrawn finding is evidence about the method: it was raised
> from a comment in our own code and would have been "fixed" into a divergence from live.

## D4 🟠 ✅ FIXED — Options are not filtered by branch, only whole fields are

**Worse than first raised.** `fld_nature_of_project` (AVYAY) does not offer Physiotherapy Clinic
or Mobile Medicare Unit to *anyone* — neither string was in its `options` array — while its help
says they are *"supported for renewal/ongoing cases only (FR-NEW-04)."* The sentence promised
project types the field never rendered, on either branch.

`FieldDef.options` is a flat `string[]`, and `fieldVisible` gates the whole field. There is no
mechanism to hide an option — so a new applicant can select a project type the rule forbids, and
nothing stops the submission.

## D5 🟡 ✅ FIXED — "Cannot be changed on a renewal" is help text, not a constraint

`fld_bank_account_id` is `required: true` with no `readOnly`, and its help says *"Carried forward
from this project — it cannot be changed on a renewal."* The very next field,
`fld_bank_account_number`, is properly `readOnly: true`. The rule is stated to the applicant and
not enforced by the form.

## D6 🟡 ✅ FIXED — Three different AVYAY step counts in three comments

| Location | Says |
|---|---|
| `form-schema.ts` file header | AVYAY **8/7**, NAPDDR **3** |
| `form-schema.ts` AVYAY section header (line ~337) | AVYAY — **7 steps** |
| `grant-wizard.tsx:12` | "(6 / **7** / 6 / **3** steps)" |
| The arrays themselves | AVYAY **8**, NAPDDR **10** |

Two of these were true when written. Both NAPDDR counts (3) are stale by seven steps.

## D7 🟠 ✅ FIXED — The parity test locks the defect in

`avyay-parity.test.ts` asserts the step list unconditionally:

```ts
test("AVYAY's steps match live's eight, Justification included", () => {
  assert.deepEqual(AVYAY_WIZARD.steps.map((s) => s.title), [ …8 titles… ]);
});
```

It tests documents per branch (`visibleDocuments(AVYAY_WIZARD, NEW)`) but steps only once, with no
branch. **All 33 e-Anudaan tests pass while D1 is live**, because the test encodes the same
assumption the code does.

**Fix:** assert 8 titles for `NEW` and 7 for `RENEWAL`, through the new `visibleSteps()`.

---

## Our clone has drifted from the vendor's live portal

**Correction to an earlier reading in this file.** `eanudaan-user-uat.mosje.in` is **the vendor's
portal, not our deployment.** Both it and `-dev` serve `/assets/index-<hash>.js` — a Vite build
with the Bhashini translation plugin — while our clone is Next.js under `/_next/`. Our clone is
not deployed at either address. So the differences below are not a stale deployment; they are
**our clone drifting from the thing it is a clone of.**

| | Vendor live (UAT) | Our clone |
|---|---|---|
| AVYAY steps, new project | 8 | 8 ✓ |
| AVYAY steps, renewal | 7 | **8** ✗ |
| AVYAY step 1, new project | FY only | FY **+ Installment** ✗ |
| SHRESHTA_M2 documents | 7 counted (10 slots rendered) | **20** ✗ |
| NAPDDR steps | 10 | 10 ✓ |

The vendor's UAT is also newer than the dev site our schema was transcribed from on 2026-08-22 —
it has gained SHRESHTA Mode 2 and a 24-role officer hierarchy. **The transcription is a year-old
snapshot of a moving target**, which is the underlying reason for every row above.

---

## What the capture missed, and why

The design audit says 43 wizard screens were captured. It did not say that they are all **one
branch**.

The saved draft the walk resumed was set to *"Ongoing / Renewal of an existing project"*, and the
walker's fill step skips controls that already hold a value — so it never flipped `case_type`.
Across the four schemes there are **four branch controllers** (`AVYAY:case_type`, `SMILE:case_type`,
`SMILE:website_available`, `SMILE:fcra_80g`) governing 7 conditional fields and 8 conditional
documents. **One branch of one controller was captured.**

Uncaptured as a result: AVYAY's entire new-project path — the Justification step, the 11-document
checklist (against renewal's 9), and the step-1 state where D2 blocks the applicant. SMILE cannot
be applied for at all (design audit M6), so all three of its controllers are unreachable.

**Fix in the capture engine:** a flow needs a `branch` step that sets a controlling field and walks
the wizard again, and `fill_all` must be able to override a value rather than only fill an empty
one. Until then, no capture of this portal is complete, and the tracker should not have implied it
was.


---

## Still open — needs a live walk

**NAPDDR's step 1 does not match ours.** Live shows *Case Type* (radio: New project / Ongoing ·
Renewal), *Project Type* (select: "DDAC — District De-Addiction Centre") and *Financial Year for
which grant is sought*. Our schema declares *Application Type* (select), *NAPDDR Intervention
Category* and *Financial Year for Grant* — different controls, different labels, and **no Case
Type at all**, so NAPDDR's renewal branch is unmodelled in our clone.

Not fixed here because guessing a fork's contents is how the drift started. It needs the walk
below.

## The re-capture that is still owed

Both branches of AVYAY and NAPDDR need walking on live, which needs the portal to hold a session.
The last attempt lost one mid-run — every screen fell from 150+ rows to 39 and a wizard state
recorded the site root as its URL. The engine now detects that and refuses to overwrite good
captures, but it cannot make the portal healthy.

Re-run when it is:

```bash
cd tools/design-audit
python3 engine/run.py --project e-anudaan --phase capture --role ngo-user
node --experimental-strip-types projects/e-anudaan/clone-parity.mjs
```

The second command prints every remaining difference between what live rendered and what our
schema declares.


---

## Audit findings applied to our clone

The design audit judges the **vendor's** portal, which we cannot change. What we can do is stop
our rebuild repeating it. Each row was checked against our own code, not assumed.

| Finding | In our clone? | Done |
|---|---|---|
| **B2** — required fields not marked programmatically | **Partly.** `FormField` already set `required` on text and select controls; the radio and checkbox branches hand-rolled their markup and carried a red asterisk and nothing else | Radio group is `role="radiogroup"` with `aria-required`, marker `aria-hidden`; required checkboxes carry `required` |
| **m3** — "«label» is required." | **Yes**, identically | `requiredMessage()` — a label that already reads as an instruction IS the sentence; one that names a thing gets the verb its control implies |
| **M1a** — a counter that exceeds its own total | **Yes.** Numerator counted every upload, denominator only the mandatory ones | `uploadProgress()` counts one set on both sides |
| **n4** — a Back button on step 1 | **No.** The DS `Wizard` already disables it on the first step | — |
| **B1** — captcha readable in the DOM | **No.** Our clone has no captcha | Raise with the vendor |
| **m1** — sub-24px targets in the accessibility bar | **Vendor's UX4G bar.** Ours is SAMAVESH | Not applicable |
| **M3** — officer vocabulary shown to applicants | **No.** Only a code comment mentions IFD; nothing user-facing | — |
| **M4** — overlapping status taxonomy | **No.** `ngoStatusLabel` already collapses the internal statuses to six applicant-facing ones, with no scheme names among them — the fix the audit asks for is already there | — |
| **M7** — three money formats | **Yes.** `₹24.38 L`, `₹24,38,356` and a bare `24,38,356` with the symbol in the column header | `rupees` / `rupeesShort` in `format.ts`, documented as never to be mixed in one table |
| **M8** — two date formats | **Yes, three shapes across two locales** | One `formatDate`, month names written out — `en-IN` renders September as "Sept" and ICU data varies by runtime |
| **M10 / O5** — two `<h1>` per page | **No.** Our shells render no masthead heading; one `<h1>` per page | — |
| **n2** — heading names the mechanism | **Yes.** "Select Grant Scheme" over a description that named the task | Swapped; description now says why the choice matters |

## The submission flow was never captured

Stated plainly because the tracker should not have implied otherwise. **No scheme reached Review
& Submit and nothing was submitted.** The furthest each got:

| Scheme | Furthest state |
|---|---|
| NAPDDR | S09 Document Uploads (of 10) |
| AVYAY | S06 Document Uploads (of 7 on the renewal branch) |
| SHRESHTA_M2 | S05 Document Uploads (of 6) |

Two causes, in order. The upload step holds its forward control shut while it verifies, and our
416-byte fixture PDF does not appear to pass that check. Then the portal began dropping sessions
mid-run, which is where the last three attempts ended.

A consequence worth knowing: the driver had been harvesting a "record id" from whatever page a
flow stopped on, so the bundle carried `NGO-DARPAN` and `GIA/2026-27/AVYAY/` as ids of
applications that do not exist — and would have told the next run a record was already there.
Only a walk that reaches a confirmation screen harvests one now, and the bogus entries are gone.
