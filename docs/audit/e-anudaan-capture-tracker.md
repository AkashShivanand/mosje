# e-Anudaan (UAT) — Capture & Audit Tracker

**Last verified:** 2026-09-07 · **Bundle:** `tools/design-audit/projects/e-anudaan/out/capture-bundle.json`
**Every number below was re-derived from the bundle and the filesystem, not carried forward.**

Reproduce the headline figures with:

```bash
cd tools/design-audit
python3 - <<'PY'
import json, collections
b = json.load(open("projects/e-anudaan/out/capture-bundle.json"))
s = b["screens"]
print(len(s), "screens,", len({x["role"] for x in s}), "roles")
print(collections.Counter("flow" if str(x.get("reachedBy")).startswith("flow") else "nav" for x in s))
print("decision screens:", sum(1 for x in s if x["slug"].endswith("-DECISION")))
PY
```

> **The previous version of this file overstated the corpus.** It claimed 229 screen states
> and 43 wizard states against a bundle holding 202 and 16. The 229 counted two slug
> generations at once — the pre- and post-`87e4d725` naming — as though they were distinct
> screens. Numbers here are reproducible by the snippet above or they do not belong here.

---

## 1. Headline

| | Count |
|---|---|
| Screen states in the bundle | **296** (was 202) |
| — reached by navigation crawl | 186 |
| — reached by a driven flow | **110** (was 16) |
| Roles captured | **25 of 25** (24 officer + 1 applicant) |
| Hosts with a recorded build fingerprint | 25 of 25 |
| Screens missing a screenshot hash | **0** |
| Screenshot + element pairs on disk | 320 (195 MB) |
| **Officer decision screens** | **21** (was 0) |
| Wizard branches walked separately | **4** (was 0) |
| Applications submitted end to end | **0 of 3** — see §4 |

## 2. What this pass added

| | |
|---|---|
| Officer **decision** screens — the sanctioning desk | **21** |
| Officer worklists captured as flow entry states | 22 |
| Wizard states on an explicitly named branch | 58 |

The decision screen lives at `/dashboard/{scheme}/{grade}/review/{id}`, **a route in no
role's navigable route list**. Twenty-five roles' worth of crawling since August produced
24 worklists and zero decision screens because the only way in is to click a table row.
It carries eleven sections the corpus had no example of, including Component-wise Cost
Sheet, Previously Allocated Funds, Sanction & Disbursement, Show Cause Notices and Audit
Trail. The available action is grade-specific — ASO offers only `Forward to SO` — which is
why all five grades of both ladders in both schemes are captured rather than a sample.

**No officer decision was fired.** All 21 flows carry `allowSubmit: false`; the engine's
`DESTRUCTIVE` pattern refuses forward/approve/reject/sanction/concur/return/query while
that gate is shut, and every capture is logged directly beneath a `submission BLOCKED`
line. A submission is additive; an officer decision mutates a case the other 23
demonstration accounts are staged against.

## 3. Wizards — where each branch actually stopped

| Scheme | Branch | Steps live | Captured | Stopped at |
|---|---|---|---|---|
| NAPDDR | new | 10 | S01–S09 (18 states) | Document Uploads |
| NAPDDR | renewal | 11 | S01–S10 (20 states) | Document Uploads |
| AVYAY | new | 8 | S01–S04 (8 states) | **Justification** — forward control would not advance |
| AVYAY | renewal | 7 | S01–S06 (12 states) | Document Uploads |
| SHRESHTA M2 | single | 6 | S01–S05 (10 states) | Document Uploads |

**NAPDDR forks, and until this pass nobody knew it.** `e-anudaan-build-defects.md` left it
as an open question; both branches are now walked and they differ structurally:

| | New project | Renewal |
|---|---|---|
| Total steps | 10 | **11** |
| `CCTV, EAT & PFMS Compliance` | absent | **present, step 8** |
| Documents on the upload step | 12 | 6 |

Our `form-schema.ts` models NAPDDR with no `case_type` at all, so there is no controller to
fork on and every applicant gets one fixed step list and one fixed document list of 17.

## 4. Why nothing submits — and why the previous diagnosis was wrong

The previous tracker said: *"The fix is a real PDF, not a code change."* That was true of a
portal that no longer exists.

**The portal now reads document CONTENT and rejects placeholders**, naming each failure:

> 12 documents are not valid. Replace them — or use Re-verify if you believe the check is wrong
> The uploaded file contains only test text ('DESIGN QC DRY RUN') and no genuine d…

In August the same step said *"Automatic check unavailable … a reviewer will verify it by
hand"* and accepted 1 KB files. The check has been switched on or repaired between the two
captures — on an unchanged build. Full evidence: `e-anudaan-live-change-report.md` §4.

**A replacement fixture does not clear this gate**, and it should not: getting past it means
producing documents that read as genuine grant evidence, which is fabricating records to
defeat a verification control. **Genuine sample documents must come from the department or
the vendor as a sanctioned test set.** This is a human step and is not worked around.

Two engine notes from the same finding:

- `12/12 already uploaded — leaving them alone`. Defect-fix #7 preserves a complete upload
  set, so a replacement fixture is never even tried. A set can be **complete and invalid at
  once** and the engine has no notion of that state, though the page says so in a countable
  sentence. Worth fixing before the next attempt.
- `FORWARD_LABELS` leads with `Save & Next`, which this portal does not use — so every
  wizard step logs a failure line above a successful advance on `Next`. Harmless, but it is
  the exact shape a real failure takes. A `forward: [Next]` override would silence it.

## 5. Outstanding

| # | Item | Blocked on |
|---|---|---|
| 1 | Post-submission acknowledgement, any scheme | Genuine sample documents (§4). **The August archive does not hold these** — in all four schemes `Step_Final_Confirmation.png` is byte-identical to that scheme's `Step_NN_Review_And_Submit.png`, and only NAPDDR's is even a review page. |
| 2 | Review & Submit for AVYAY and SHRESHTA M2 | Same |
| 3 | AVYAY new-project steps 5–8 | The forward control would not advance past Justification |
| 4 | Colour contrast verified | The extractor does not resolve inherited backgrounds |
| 5 | Accessible names captured | Element rows read visible text, not `aria-label`; the field inventory does read it |
| 6 | Keyboard and screen-reader pass | Human work |
| 7 | Hindi / bilingual rendering | The language toggle has never been exercised |
| 8 | Mobile and tablet layouts | Every screen in the corpus is 1440px wide |
| 9 | Engine test suite | `pytest` is not installed on this host; the suite was **not** run this pass. No engine code changed — the edits were a manifest, a fixture and `clone-parity.mjs`. |

### Deliberately not done
No officer decision was exercised (§2). No document was fabricated to pass the content
check (§4).

## 6. Known traps when reading this corpus

- **`pageH` varies between runs on unchanged content.** Eleven screens differ in measured
  page height with identical row counts. Compare `structureHash` and `totalRows`.
- **A screen with the chrome-only row count may be a failed capture.** On this portal that
  count is **39**. Eight applicant screens sat at 39 in the 2026-09-03 bundle — page chrome,
  no content — and were recorded as `ok`. Five screens legitimately read 39 today: the
  `/queries` lists really are empty, confirmed by two runs a week apart.
- **`clone-parity.mjs` over a partial corpus invents.** Run against a capture missing steps
  it reports every uncaptured field as one live never rendered. Run it only after a
  complete walk.

## 7. Where everything lives

| Artefact | Path |
|---|---|
| Bundle | `tools/design-audit/projects/e-anudaan/out/capture-bundle.json` |
| Screenshots + element rows | `projects/e-anudaan/captures/live/` — 320 pairs (195 MB), not tracked |
| Change report, this pass | `docs/audit/e-anudaan-live-change-report.md` |
| Findings log, this pass | `docs/audit/e-anudaan-reclone-findings.md` |
| Plan for this pass | `docs/plans/2026-09-07-e-anudaan-reclone.md` |
| Traversal recipe | `projects/e-anudaan/screen-manifest.yaml` |
| Roles, routes, auth | `projects/e-anudaan/audit.config.json` |
| Credentials | `projects/e-anudaan/secrets.json` — gitignored |
| The UI/UX audit | `docs/audit/e-anudaan-uat-design-audit.md` |
| Build defects (our code) | `docs/audit/e-anudaan-build-defects.md` |

**Re-running:**

```bash
cd tools/design-audit
python3 engine/run.py --project e-anudaan --phase capture --force
node --experimental-strip-types projects/e-anudaan/clone-parity.mjs   # from the repo root
```
