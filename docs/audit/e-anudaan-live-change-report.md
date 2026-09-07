# e-Anudaan (UAT) — what changed on the live portal since the last clone

**Compared:** capture of 2026-09-03 ⟷ re-capture of 2026-09-07
**Corpus:** 202 screen states → **296**
**Method:** the engine's own `structureHash` (element tree and text, volatile patterns
masked) and `geometryHash` (position and size), per screen, plus the build fingerprint of
each host. The before-state was read back out of git rather than from a hand-made snapshot,
after the snapshot proved to have stored a file path where a row count belonged.

---

## 1. The short answer

**The vendor has not shipped a new build, and not one screen's content changed.** But the
portal does behave differently, in a way none of the above could detect. See §4.

| | 2026-09-03 | 2026-09-07 |
|---|---|---|
| Applicant portal build | `index-CPyM5NBh.js` | `index-CPyM5NBh.js` |
| Officer portal build | `main.182b26ac.js` | `main.182b26ac.js` |

Identical on both hosts. The vendor's **dev** environment was serving `main.6ba8a45b.js` at
the same moment, so work is happening — it has not reached UAT.

## 2. Screen-by-screen

| Result | Screens | |
|---|---|---|
| **Unchanged** | **177** | structure and geometry both identical |
| Content changed | **0** | no screen's text or data moved |
| "Structure changed" | 8 | **not a portal change — see §3a** |
| "Geometry only" | 11 | **not a portal change — see §3b** |
| Added | 100 | new coverage, see §5 |
| No longer captured | 6 | superseded slugs, see §5 |

## 3. The 19 apparent differences are ours, not the vendor's

Reporting either group as a live change would have been wrong. Both were checked before
being written down.

### 3a. Eight applicant screens: the PREVIOUS capture was empty

All eight had **exactly 39 rows** in the old bundle. Eight different pages cannot
coincidentally carry the same element count; 39 is the masthead, accessibility bar,
sidebar and footer with **no page content at all**. The 2026-09-03 run photographed the
applicant portal's navigation as empty shells — the SPA had not rendered when the shot was
taken — and recorded each one as `ok`.

| Screen | Rows then | Rows now |
|---|---|---|
| `NGO-USER-NGO-NOTIFICATIONS` | 39 | **277** |
| `NGO-USER-NGO-BANK-ACCOUNTS` | 39 | **150** |
| `NGO-USER-NGO-MY-APPLICATIONS-DEFICIENCIES` | 39 | **112** |
| `NGO-USER-APPLY-GRANT` | 39 | 56 |
| `NGO-USER-NGO-ATTENDANCE` | 39 | 54 |
| `NGO-USER-NGO-ATTENDANCE-MASTER` | 39 | 53 |
| `NGO-USER-NGO-PROJECT-LOCATION-CHANGE` | 39 | 49 |
| `NGO-USER-NGO-CCTV` | 39 | 46 |

Two applicant screens were fine in both runs (`NGO-USER-NGO-DASHBOARD` 152,
`NGO-USER-NGO-MY-APPLICATIONS` 153), which is why nobody noticed.

**Consequence: the applicant portal's navigation section of the previous corpus was
worthless**, and any judgement made from it — including parts of the design audit — rests
on blank pages. The current corpus is the first with real content on those eight.

**Five screens still read 39 rows, and those are genuine.** Every
`/dashboard/{pd,us,aso,js}/…/queries` list is empty in both runs — a real empty state, not
a failed capture, confirmed by being identical across two runs a week apart.

### 3b. Eleven screens: capture-side viewport variance

Ten SHRESHTA M2 wizard states and one PD worklist have **identical row counts** before and
after (99→99, 104→104, 121→121, 123→123, 176→176, 105→105) and differ only in `pageH`,
which lands on a uniform 3070. Identical content at a different measured page height is the
height-settling routine resolving differently between runs. Nothing on the portal moved.

## 4. What DID change — and no hash could see it

**The automatic document check was unavailable in August. It is active now, and it rejects
placeholder documents.**

August (`docs/audit_screenshots/e-anudaan/ngo/02_avyay/`, 2026-09-02) — each ~1 KB document
accepted, marked `Uploaded` / `Not verified`, above the portal's own words:

> **Automatic check unavailable** — We could not check this document automatically. Your
> upload is saved and a reviewer will verify it by hand — you do not need to do anything.

Today, same step, same build:

> **12 documents are not valid.** Replace them — or use Re-verify if you believe the check is wrong
> The uploaded file contains only test text ('DESIGN QC DRY RUN') and no genuine d…
> This appears to be a test or placeholder file. Please upload the actual supporting document.

The service now reads document **content** and refuses substantively empty files, naming
each failure. A build-fingerprint diff, a screenshot diff and a structure-hash diff all
miss this, because it only manifests once a document is uploaded — which is why the
re-clone had to walk the wizards rather than only crawl the routes.

**It is also why the previous tracker's diagnosis was wrong.** It recorded the stuck upload
step as needing "a real PDF, not a code change". In August there was no check to fail; the
walk stopped for a different reason. A replacement fixture does not clear today's gate
either — see §6.

## 5. The 100 added and the 6 removed

| Added | |
|---|---|
| Wizard states on a named branch (`…-NEW-`, `…-RENEWAL-`) | **58** |
| Officer **decision** screens | **21** |
| Officer worklists captured as flow entry states | **21** |

Removed: six slugs superseded by the branch-aware naming
(`NGO-AVYAY-S06-…`, `NGO-NAPDDR-S09-…`, `NGO-SHRESHTA-M2-STEP-…`). Their content is
carried by the new `-NEW-` / `-RENEWAL-` states.

## 6. What is still not captured

| # | Item | Blocked on |
|---|---|---|
| 1 | Any post-submission acknowledgement, for any scheme | Genuine sample documents. The placeholder check is working correctly and clearing it means fabricating grant evidence — refused. **The August archive does not hold these either** (see below). |
| 2 | Review & Submit for AVYAY, SHRESHTA M2 | Same |
| 3 | AVYAY new-project steps beyond Justification (step 4) | The forward control would not advance; the step's required fields were not satisfiable by the filler |
| 4 | Mobile and tablet layouts | Every screen in the corpus is 1440px wide |
| 5 | Hindi / bilingual rendering | The language toggle has never been exercised |

**The August archive was checked and does not contain the submission screens.** In all four
schemes `Step_Final_Confirmation.png` is **byte-identical** to that scheme's
`Step_NN_Review_And_Submit.png` — one file saved under two names:

| Scheme | What the file called "Final Confirmation" actually shows |
|---|---|
| NAPDDR | The Review & Submit page — genuine |
| AVYAY | Document Uploads, "Not verified" |
| SHRESHTA M2 | Document Uploads, `0 / 7 uploaded`, Next disabled |
| SMILE / Garima Greh | An Organisation Details form, still being filled |

Of eight files asserting review-or-confirmation coverage, one is a review page and none is
a post-submission acknowledgement.

## 7. Reproducing this

```bash
cd tools/design-audit
python3 engine/run.py --project e-anudaan --phase capture --force
git show origin/main:tools/design-audit/projects/e-anudaan/out/capture-bundle.json > /tmp/before.json
```

Then diff `totalRows`, `structureHash` and `geometryHash` per slug between `/tmp/before.json`
and `out/capture-bundle.json`. The classification from this run is
`out/change-2026-09-07.json`.

**Do not compare `pageH` alone** — §3b shows it varies between runs on unchanged content.
**Do not trust a screen whose `totalRows` equals the chrome-only count** (39 on this
portal) without checking whether the page is genuinely empty — §3a shows eight that were
not.
