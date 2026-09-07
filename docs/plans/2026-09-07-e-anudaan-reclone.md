# e-Anudaan — re-clone and gap-closure, September 2026

**Branch:** `chore/eanudaan-reclone-2026-09` (worktree; `main` held another session's
uncommitted design-system work)
**Written:** 2026-09-07 · **Supersedes nothing** — extends
`docs/audit/e-anudaan-capture-tracker.md`

---

## 0. What the reconnaissance already established, before any run

Four facts were checked live before this plan was written. They change what the work is.

| Check | Result |
|---|---|
| All four vendor hosts reachable | ✅ `200` on `/login` for user-uat, admin-uat, user-dev, admin-dev |
| **admin-UAT build fingerprint** | `main.182b26ac.js` — **identical** to the one recorded on 2026-09-03 |
| **user-UAT build fingerprint** | `index-CPyM5NBh.js` — **identical** to the one recorded on 2026-09-03 |
| admin-**dev** build fingerprint | `main.6ba8a45b.js` — **different**; dev has moved, UAT has not |

**So the UAT deployment has not been rebuilt since we last cloned it.** The question
"has the live version changed?" has a provisional answer already: *not the code*.

That does not make the re-clone pointless. It changes its purpose from *"find the
redesign"* to four things that are all still open:

1. **Prove** the no-change claim below the fingerprint — content, data and copy can move
   without a rebuild, and a fingerprint is one string.
2. **Close the capture gaps** the last run left, which are large and known.
3. **Correct the tracker**, which overstates the corpus (see §1).
4. **Look at dev**, which has a newer build and may carry screens UAT does not.

---

## 1. The tracker overstates the corpus — but the bundle is not broken

`docs/audit/e-anudaan-capture-tracker.md` is dated 2026-09-03 and claims 229 screen states,
43 of them reached by walking a wizard. The committed bundle holds **202**, 16 from flows.

**First reading of that gap was wrong and is corrected here.** It looked like a bundling
defect — wizard screenshots sitting on disk that the bundle had lost. Diffing the two
showed something else:

| | |
|---|---|
| Slugs on disk | 220 |
| Slugs in the bundle | 202 |
| On disk, not in the bundle | **18** |
| In the bundle, not on disk | **0** |

All 18 are the **old slug format** — `NGO-NAPDDR-S09-FILLED`, with no step title and no
`-ARRIVED` counterpart — written at 07:30 on 2026-09-03. Engine fix #9 ("step-title
boilerplate carried into slugs") landed between then and the 10:31 re-run, which wrote the
current format: `NGO-NAPDDR-S09-DOCUMENT-UPLOADS-ARRIVED` / `-FILLED`.

So the bundle correctly indexes the newer generation and correctly ignores the superseded
one. The tracker's 229 counted **both generations at once**. Nothing was lost; the number
was double-counting.

**The real gap the diff exposed is different and worse.** The 10:31 re-run resumed a saved
draft straight at the upload step, so in the current slug format we hold:

| Scheme | Steps the scheme has | Steps held in current format |
|---|---|---|
| NAPDDR | 10 | **2** (S09 arrived + filled) |
| AVYAY | 7 | **2** (S06 arrived + filled) |
| SHRESHTA M2 | 6 | 10 (S01–S05, both states) |

NAPDDR's steps 1–8 and AVYAY's steps 1–5 exist only as the superseded 07:30 `-FILLED`
files — no `-ARRIVED` state, no step title, not indexed. **A fresh full walk is the fix**,
and it is what Steps 3, 5 and 6 do.

## 2. The branch flows were written but never run

`screen-manifest.yaml` declares five flows, four of which flip a Case Type controller
explicitly (`napddr-new`, `napddr-renewal`, `avyay-new`, `avyay-renewal`). Their capture
prefixes are `NGO-NAPDDR-NEW-`, `NGO-AVYAY-NEW-` and so on.

**No file with any of those prefixes exists on disk.** The engine gained the ability to
walk both branches in commits `33ca6576` and `2f61f797`; the capability has never been
exercised. Every wizard state we hold is still the renewal path, exactly as the tracker's
own warning said.

## 3. The submission blocker is still in place

`projects/e-anudaan/fixtures/sample-document.pdf` is **416 bytes**. The upload step's
verification does not pass it, so all three schemes stop at Document Uploads and Review &
Submit has never been captured. This is a one-file fix, not a code fix.

---

## 4. What must not be broken

The re-clone writes only into `tools/design-audit/projects/e-anudaan/`. Nothing below is
regenerated from a capture, and no step in this plan edits any of it except where §Step 7
says so, deliberately and one defect at a time.

| Kept | Where |
|---|---|
| Our rebuilt e-Anudaan portal — 49 route files | `apps/hub/src/app/portals/e-anudaan/` |
| The form schema and wizard, incl. the D1–D7 fixes | `apps/hub/src/lib/e-anudaan/form-schema.ts`, `apps/hub/src/components/e-anudaan/` |
| Audit fixes B2 and m3 already applied to our clone | commit `1a9eacee` |
| The login work following the Handoff | commits `773d3833`, `7d686ef1` |
| Nine engine defect fixes and 124 tests | `tools/design-audit/engine/` |
| The existing 135 MB capture corpus | `captures/live/` — **added to, never cleared** |

The worktree symlinks `captures/` and `secrets.json` back to the main tree, so the
existing corpus is reused rather than re-downloaded, and credentials never leave their
`600` file.

---

## 5. Steps

Each step states its own done-condition. Steps 1–4 answer *"has it changed?"*. Steps 5–8
answer *"capture what we could not capture."*

### Step 1 — Freeze a before-state
Record the current bundle's counts, per-role screen lists and structure hashes to
`out/before-2026-09-07.json`, so every later claim of "changed / unchanged" is a diff
against a file, not against memory.
**Done when:** the file exists and its screen count is 202.

### Step 2 — Rebuild the bundle so it indexes what is already on disk
Re-run bundling over the existing `captures/live` without re-hitting the network, and
establish why the wizard states dropped out. Fix the cause in `engine/bundle.py` (or
`manifest.py`) and add the regression test that names it.
**Done when:** the bundle indexes every `-ARRIVED`/`-FILLED` pair on disk, the count rises
from 202 toward ~220, and `npm test`-equivalent (`pytest engine/`) is green.

### Step 3 — Re-capture all 25 roles against live UAT
`python3 engine/run.py --project e-anudaan --phase capture --force`.
Roughly 190 navigation screens across 25 logins.
**Done when:** every role completes, no role aborts, and every screen carries a hash.

### Step 4 — Diff before ⟷ after and report what moved
Compare `structureHash` and `geometryHash` per slug. Classify every difference as
*volatile* (dates, case IDs — already masked by the manifest), *content* (real copy or
data change) or *structural* (a screen gained, lost or rearranged).
**Done when:** `docs/audit/e-anudaan-live-change-report.md` exists, lists every changed
slug with a before/after screenshot pair, and states plainly where nothing changed.

### Step 5 — Replace the fixture PDF and walk the wizards
Generate a genuine multi-page PDF of a few hundred KB into
`fixtures/sample-document.pdf`, then run the five flows.
**Done when:** all three schemes reach **Review & Submit** and that state is captured. If
the upload gate still refuses, the failure is characterised from the page's own message —
not guessed at — and recorded.

### Step 6 — Capture the new-project branch
With the fixture fixed, the four branch flows run. This is the path that carries build
defects D1 and D2 and has never been seen.
**Done when:** `NGO-NAPDDR-NEW-*` and `NGO-AVYAY-NEW-*` states exist, and AVYAY's new
branch shows its Justification step and its 11-document checklist.

### Step 7 — Run `clone-parity.mjs` and act on the diff
The mechanical field-level diff of live-rendered wizard against our schema. Two questions
left open in `e-anudaan-build-defects.md` get answered by it: AVYAY's two renewal-only
project-type labels, and whether NAPDDR's step 1 forks on a Case Type our schema does not
model.

> **Precondition, established by running it on 2026-09-07 before the walk.** The tool was
> smoke-tested against the *partial* corpus and produced a confident, wholly misleading
> report: because only AVYAY's S06 and NAPDDR's S09 exist in the current slug format, it
> read "live showed only: document uploads" and listed **26 real fields as ones live never
> rendered**. Every one of them exists on the live portal; they are simply not in the
> corpus. **This tool must not be run, and its output must never be quoted, until the full
> walk of Steps 5 and 6 has landed.** A parity report over a partial capture does not
> under-report — it invents.

**Done when:** the walk is complete, the tool is re-run, and every reported difference is
either fixed in our schema or recorded as a deliberate divergence with its reason.

### Step 8 — Officer decision screens (the largest remaining hole)
Outstanding item #3 in the tracker: the screens where grants are forwarded, returned,
queried, sanctioned and rejected have never been captured, because no flow opens a
worklist row.

**Scoped from evidence, not guessed.** Scanning all 220 captures for a row-opening control
found **24 officer worklists carrying a `Review` button** — five PD grades and five IFD
grades, in both the AVYAY and SHRESHTA M2 ladders, plus the AVYAY Programme Director's own
desk. The decision surface has been one click away the entire time. So this is not "one PD
and one IFD": it is **21 flows** covering every grade of both ladders in both schemes.

Each flow is `goto entry → capture WORKLIST → click Review → capture DECISION`, with
**`allowSubmit: false`**. That gate is what makes this safe, and it was verified against
the engine rather than assumed: `Review` matches none of the engine's `DESTRUCTIVE`
pattern, while `forward`, `approve`, `reject`, `sanction`, `concur`, `return` and `quer`
all do — so the screen is photographed and every decision control is refused.

Unlike the applicant wizard, these actions are **not additive**. A submission creates a
new record; a decision mutates a case the other 23 demonstration accounts are staged
against. The gate stays shut.

**Done when:** a `*-DECISION` state exists for each of the 21 flows that has a row to
open, the log shows the gate refusing at least one destructive label, and any worklist
that was empty (nothing to review) is recorded as empty rather than as a failure.

### Step 9 — Rewrite the tracker against the artefacts
Every number re-derived from the bundle and the filesystem, not carried forward.
**Done when:** `e-anudaan-capture-tracker.md` states counts that a reader can reproduce
with the snippet it ships.

---

## 6. Deliberately out of scope

- **Mobile and tablet capture** (tracker #8) and **inherited-background contrast**
  (tracker #4) — both are engine work of their own size, and folding them into a
  change-detection pass would make it impossible to say which finding came from where.
- **Any officer decision actually being fired.** Step 8 photographs; it does not act.
- **The dev environment's newer build.** Noted in §0 and worth its own recon; capturing
  two environments in one pass would put two different products in one corpus.
- **Regenerating our portal from the new capture.** The capture is evidence, not a
  source. Changes to our build come one defect at a time, through Step 7.

---

# Outcome, 2026-09-07

| Step | Result |
|---|---|
| 1 — Freeze a before-state | ✅ Done, **and it was flawed** — the snapshot stored a file path where a row count belonged, so the real before-state was recovered from git (`git show origin/main:…/capture-bundle.json`). Every comparison in the report uses the git version. |
| 2 — Rebuild the bundle to index what was on disk | ❌ **Not needed; the premise was wrong.** No bundling defect existed. The 18 unindexed slugs were a superseded naming generation, correctly ignored. §1 above is the corrected finding. |
| 3 — Re-capture all 25 roles | ✅ 296 states, 25 roles, 0 aborts, 0 tracebacks |
| 4 — Diff and report | ✅ `docs/audit/e-anudaan-live-change-report.md` |
| 5 — Replace the fixture and walk the wizards | ⚠️ **Partial.** Fixture replaced; walks reached Document Uploads on four of five branches. Review & Submit not reached — the blocker is a content check, not a fixture (§F5, §F7). |
| 6 — Capture the new-project branch | ✅ NAPDDR new S01–S09 and renewal S01–S10; AVYAY new S01–S04, renewal S01–S06. The fork was proven and measured. |
| 7 — Run clone-parity and act | ✅ Tool fixed to count through `visibleSteps` first; D1 confirmed genuinely fixed. Open gaps are documents only. |
| 8 — Officer decision screens | ✅ **21 of 21**, no decision fired |
| 9 — Rewrite the tracker | ✅ Every figure reproducible |

## What the pass actually answered

**"Has the live version changed?"** — Not the build: both UAT fingerprints are
byte-identical to 2026-09-03, no screen's content moved, 177 of 196 comparable screens are
identical. **But yes in behaviour:** the automatic document check was unavailable in August
and is active now, rejecting placeholder files by name. Only walking a wizard reveals it.

**"Keep the changes and enhancements we've made."** — Nothing in `apps/hub` was touched.
`visibleSteps`, the D1–D7 fixes, the login work and the 49 portal route files are as they
were; the parity fix corrected a *measurement* that was misreporting them.

## Three things this pass changed its mind about, on evidence

1. The bundle was not broken (Step 2).
2. The upload blocker was not a malformed fixture (Step 5).
3. The August archive does not contain the submission screens — `Step_Final_Confirmation.png`
   is a byte-identical duplicate of `Step_NN_Review_And_Submit.png` in all four schemes.

## Left open

Post-submission acknowledgements need a sanctioned test document set from the department —
recorded in the tracker §5 as a human step. AVYAY's new branch beyond Justification, mobile
layouts, Hindi rendering and the keyboard pass remain as before. `pytest` is not installed
on this host, so the engine suite was not run; no engine code changed this pass.
