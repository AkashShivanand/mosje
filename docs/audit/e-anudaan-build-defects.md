# e-Anudaan — defects in OUR build

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

## D1 🔴 — AVYAY renders the same number of steps on both branches

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

## D2 🔴 — A new-project applicant is forced to pick an installment number

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

## D3 🟠 — SHRESHTA_M2 asks a first-time institution when its grant began

`fld_gia_since_year`, "Year from which GIA received under SHRESHTA", is `required: true` and always
shown. Its help says *"Applies to ongoing institutions."*

SHRESHTA_M2 has **zero conditional fields and zero conditional documents** — it has no branch
mechanism at all, so there is nowhere for this rule to live yet.

## D4 🟠 — Options are not filtered by branch, only whole fields are

`fld_nature_of_project` (AVYAY) offers Physiotherapy Clinic and Mobile Medicare Unit to everyone,
while its own help says they are *"supported for renewal/ongoing cases only (FR-NEW-04)."*

`FieldDef.options` is a flat `string[]`, and `fieldVisible` gates the whole field. There is no
mechanism to hide an option — so a new applicant can select a project type the rule forbids, and
nothing stops the submission.

## D5 🟡 — "Cannot be changed on a renewal" is help text, not a constraint

`fld_bank_account_id` is `required: true` with no `readOnly`, and its help says *"Carried forward
from this project — it cannot be changed on a renewal."* The very next field,
`fld_bank_account_number`, is properly `readOnly: true`. The rule is stated to the applicant and
not enforced by the form.

## D6 🟡 — Three different AVYAY step counts in three comments

| Location | Says |
|---|---|
| `form-schema.ts` file header | AVYAY **8/7**, NAPDDR **3** |
| `form-schema.ts` AVYAY section header (line ~337) | AVYAY — **7 steps** |
| `grant-wizard.tsx:12` | "(6 / **7** / 6 / **3** steps)" |
| The arrays themselves | AVYAY **8**, NAPDDR **10** |

Two of these were true when written. Both NAPDDR counts (3) are stale by seven steps.

## D7 🟠 — The parity test locks the defect in

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
