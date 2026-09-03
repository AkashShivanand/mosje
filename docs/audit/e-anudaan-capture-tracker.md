# e-Anudaan (UAT) — Capture & Audit Tracker

**Last verified:** 2026-09-03 · **Bundle:** `tools/design-audit/projects/e-anudaan/out/capture-bundle.json`
**Engine status:** merged to `main` via PR #258; one later commit still on the branch.
**Verified by reading the bundle and the files on disk, not from the run logs.**

Rerun the verification behind every number here with:

```bash
cd tools/design-audit
python3 - <<'PY'
import json, collections
b = json.load(open("projects/e-anudaan/out/capture-bundle.json"))
print(len(b["screens"]), "screens,", len({s["role"] for s in b["screens"]}), "roles")
print(collections.Counter(s["reachedBy"] for s in b["screens"]
                          if str(s["reachedBy"]).startswith("flow:")))
PY
```

---

## 1. Headline

| | Count |
|---|---|
| Screen states in the bundle | **229** |
| — reached by navigation crawl | 186 |
| — reached by walking a wizard | 43 |
| Roles captured | **25 of 25** (24 officer + 1 applicant) |
| Hosts with a recorded build fingerprint | 25 |
| Screens missing a screenshot hash | **0** |
| Screenshots + element files on disk | 268 pairs (153 MB) |
| Applications submitted end to end | **0 of 3** |

---

## 2. Roles — all 25 captured

| Family | Roles | Screens | Status |
|---|---|---|---|
| Applicant | `ngo-user` | 49 | ✅ Complete (nav + 3 wizards) |
| AVYAY — Programme Division | `avyay-pd-{aso,so,us,ds,js}` | 8–9 each | ✅ Sidebar routes complete |
| AVYAY — Integrated Finance | `avyay-ifd-{aso,so,us,ds,js}` | 6–7 each | ✅ Sidebar routes complete |
| AVYAY — PMU & Director | `avyay-pmu-inspections`, `avyay-programme-director` | 6 each | ✅ Sidebar routes complete |
| SHRESHTA M2 — Programme Division | `sm2-pd-{aso,so,us,ds,js}` | 9–11 each | ✅ Sidebar routes complete |
| SHRESHTA M2 — Integrated Finance | `sm2-ifd-{aso,so,us,ds,js}` | 7–8 each | ✅ Sidebar routes complete |
| SHRESHTA M2 — PMU & Director | `sm2-pmu-field-officer`, `sm2-programme-director` | 4–5 each | ✅ Sidebar routes complete |

**Credentials** for all 25 are in `projects/e-anudaan/secrets.json` (gitignored, mode 600), taken
from the sheet. The applicant login needs a captcha; the engine reads it from the DOM and answers
it automatically — see B1 in the audit for why that is possible at all.

---

## 3. Wizards — where each one actually stopped

Each scheme puts every form section behind `/step-1`, uploads behind `/step-2`, and the end at
`/review`. The number of internal sections differs per scheme, which is why the walker reads
"Step N of M" off the page rather than being told.

| Scheme | Steps | Captured | Reached | Outstanding |
|---|---|---|---|---|
| **NAPDDR** | 10 | S01–S09 | Document Uploads (9 of 10) | Review & Submit, submission |
| **AVYAY** | 7 | S01–S06 | Document Uploads (6 of 7) | Review & Submit, submission |
| **SHRESHTA_M2** | 6 | S01–S05 | Document Uploads (5 of 6) | Review & Submit, submission |

Two states are captured per step — `-ARRIVED` (as the page was found) and `-FILLED` (after the
walker filled and uploaded) — plus one `-VALIDATION-ERRORS` per scheme, taken by submitting the
first step empty.

### Why all three stop at the same step

Not a portal fault and not a timeout. The upload step disables "Next →" while it verifies the
files, and says so: *"Checking 12 documents… this takes a few seconds. Next opens as soon as the
check completes."* An earlier run replaced the twelve real documents with a **416-byte fixture
PDF**, and that fixture appears not to pass the check — so the gate the portal opens for a valid
document never opens for ours.

**The fix is a real PDF, not a code change.** `projects/e-anudaan/fixtures/sample-document.pdf`
needs replacing with a genuine, readable document of a few hundred KB. Until then the walk will
keep stopping in the same place, correctly.

---

## 4. Engine work — done

Each row was found by a live run, not by review, and each carries a regression test.

| # | Defect | Effect if unfixed | Commit |
|---|---|---|---|
| 1 | Wizard steps numbered by hand in the manifest | The review page was filed under a document page's slug, with real hashes, for the whole 14-day staleness window | `1634c82a` |
| 2 | Freshness never checked the manifest | Adding three flows produced `reuse-all` — no browser launched, the flows silently never ran | `1634c82a` |
| 3 | Flow-state absolute URLs carried into the route crawl | Navigated to `https://host` + `https://host/path`; 7 DNS failures per run | `60f53b64` |
| 4 | A flow exception aborted the whole role | `ROLE ABORTED` discarded the two flows that had not started | `3cff282b` |
| 5 | `captureValidation` reload demanded networkidle | Raised on an SPA holding a connection open — the trigger for #4 | `3cff282b` |
| 6 | Review page matched on `review\|declar\|submit` | "Verification & Declaration" (step 8 of 10) read as the end; all three schemes stopped 3 steps early | `0cfc22fb` |
| 7 | Re-uploaded an already-complete document set | Replaced 12 verified documents with a fixture, putting a ready step back into verification | `62746ee9` |
| 8 | Clicked the forward control without checking it was enabled | Burned Playwright's 30s timeout and reported a working portal as blocked | `62746ee9` |
| 9 | Step-title boilerplate carried into slugs | `…-PREPAREDNESS-FIELDS-MARKED-ARE`, truncated mid-word | pending commit |

**Tests: 80 → 112.** Every fix above names, in its test docstring, the failure it gates.

---

## 5. Audit — done

`docs/audit/e-anudaan-uat-design-audit.md`

| Severity | IDs | Count |
|---|---|---|
| 🔴 Blocker | B1, B2 | 2 |
| 🟠 Major | M1, M1a, M1b, M2–M10, m1, O1–O5 | 19 |
| 🟡 Minor | m2–m7 | 6 |
| ⚪ Nit | n1–n5 | 5 |

Two claims in the first draft were **corrected**, both recorded in the document itself:

| Claim | Correction |
|---|---|
| "1,575 interactive elements under 24px" | Counted every element, not pointer targets. Real figures: 614/1,449 applicant, 1,469/4,985 officer — and they are four repeated accessibility-bar controls plus real product actions. Re-graded to major. |
| "The upload step disables Next with no explanation" | The opposite. All three schemes explain the wait and its end condition. It is the best-behaved control in the wizard. |

---

## 6. Outstanding

| # | Item | Blocked on | Effort |
|---|---|---|---|
| 1 | Three applications submitted end to end | A valid fixture PDF that passes automatic verification | Small — replace one file, re-run |
| 2 | Review & Submit captured for all three schemes | Same as #1 | Same run |
| 3 | **The officer decision screen** — where grants are forwarded, returned, queried, sanctioned and rejected | A flow that opens a worklist row; not yet written | Medium |
| 4 | Colour contrast verified | The extractor does not resolve inherited backgrounds — only 1,385 of 19,280 pairs were resolvable | Medium (engine) |
| 5 | Accessible names captured | The extractor reads visible text, not `aria-label`. 2,792 officer buttons cannot be judged either way, and finding o6 is left open because of it | Small (engine), then a full re-capture |
| 6 | Keyboard and screen-reader pass | Human work — the machine draft cannot self-certify | Human |
| 7 | Hindi / bilingual rendering | The language toggle was never exercised | Human |
| 8 | Mobile and tablet layouts | Every screen in the corpus is 1440px wide | Small (config), then a re-capture |
| 9 | One commit not yet on `main` | PR **#258** merged `feat/design-audit-capture-bundle` into `main` on 2026-09-03. Everything above is on `origin/main` **except** the tracker + slug commit, which was made after the merge | Small — new PR from `main` |

### Deliberately not done

**No officer decision was exercised.** Forward, Approve, Return, Query and Reject were never
clicked. The three wizard submissions are additive — they create new records. Officer decisions
mutate cases the other 23 demo accounts are staged against, and a UAT environment about to be shown
to stakeholders is not a place to spend that state. When the decision screen is captured, its flow
should carry `allowSubmit: false` so the gate refuses the click.

---

## 7. Where everything lives

| Artefact | Path |
|---|---|
| Bundle (hashed index of every screen) | `tools/design-audit/projects/e-anudaan/out/capture-bundle.json` |
| Screenshots + element rows | `tools/design-audit/projects/e-anudaan/captures/live/` — 268 pairs, not tracked in git |
| Freshness report | `tools/design-audit/projects/e-anudaan/out/freshness.md` |
| Traversal recipe | `tools/design-audit/projects/e-anudaan/screen-manifest.yaml` |
| Roles, routes, auth | `tools/design-audit/projects/e-anudaan/audit.config.json` |
| Credentials | `tools/design-audit/projects/e-anudaan/secrets.json` — gitignored |
| The audit | `docs/audit/e-anudaan-uat-design-audit.md` |
| This tracker | `docs/audit/e-anudaan-capture-tracker.md` |

**Re-running:**

```bash
cd tools/design-audit
python3 engine/run.py --project e-anudaan --phase capture             # all 25 roles
python3 engine/run.py --project e-anudaan --phase capture --role ngo-user   # the wizards only
```

`--force` is no longer needed after a manifest edit: a changed recipe now invalidates the bundle
on its own.
