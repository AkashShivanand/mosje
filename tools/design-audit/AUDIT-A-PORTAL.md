# Audit a portal — the end-to-end manual

The complete lifecycle for auditing **any** portal (Figma design vs live build), from nothing to a
polished, human-reviewed report + defect tracker + editable Figma report. Follow the steps; each links
to the deep-dive when you need it.

- **Just want the fast version?** → **[USER-GUIDE.md](USER-GUIDE.md)** (describe it in a sentence, done).
- **Want to understand *why* it's built this way?** → **[HOW-IT-WORKS.md](HOW-IT-WORKS.md)**.
- **Home / all docs** → **[README.md](README.md)**.
- **The rules the audit learns by** → `~/.claude/skills/design-qc/references/audit-rules.md` (read the
  **Canonical playbook** at the top before any run).

Most steps are run by the **assistant** (the `/design-qc` skill drives the engine). You provide inputs
and review. Where a human must act, it says **👤 you**.

---

## The shape of the work (two halves, five deliverables)

The engine does the **deterministic half** (enumerate → capture → per-element conformance → gates →
MACHINE-DRAFT). The `/design-qc` skill + you do the **judgment half** (right component? hierarchy? which
findings are Global? severity calibration? human a11y/brand sign-off).

Five deliverables, all generated from one **`audit-master.json`** (the single source of truth):

| # | Deliverable | Made by | Audience |
|---|---|---|---|
| 1 | **MACHINE-DRAFT PDF/HTML** (🤖/👤 stamps, DS-adoption + coverage tiles) | `engine/run.py` | first look, honest machine pass |
| 2 | **Curated per-screen PDF** (navy cover + severity tiles + DESIGN\|BUILD boards + pinned findings) | `projects/<name>/build_final_report.py` → `generate_pdf.py` | stakeholders / devs |
| 3 | **Master Excel tracker** (one row per finding: ID · Screen · Category · Severity · Issue · Fix · links · **Scope** · Status) | same script → `docs/qc/MoSJE-Portal-QC-Tracker.xlsx` | dev workflow / status tracking |
| 4 | **Editable Figma review sheet** (3-column DESIGN\|BUILD\|ISSUES, one row per screen) | assistant via Figma MCP | 👤 you edit the issues here |
| 5 | **Pinned Figma report** (side-by-side boards + **draggable numbered pins** + finding cards) | assistant via Figma MCP | design-team-grade, adjust pins |

2 + 3 are kept in **lockstep** and re-generated together. 4 is your editing surface — edit issues, say
**"sync from Figma"**, and the assistant folds your edits into 2 + 3 and re-runs the mapping gate.

---

## 0. What you need (the only things it ever needs from you)
- The **Figma** design (file link; ideally the frames/sections for each screen).
- The **live URL(s)** — public site, and the admin login page if separate.
- The **logins** per role (username / password). Public-only sites need none.

## 1. Onboard the portal (once)
- **Plain English:** *"audit our `<portal>`; design `<figma link>`; site `<url>` (admin `<url>`); logins:
  Officer = user/pass, …"* — the assistant runs `engine/bootstrap.py`, which writes
  `projects/<name>/audit.config.json` + a **gitignored** `secrets.json` and **auto-detects** the login form.
- **By hand:** copy **[projects/_template/](projects/_template/README.md)** and fill `audit.config.json`
  (figma file/root, live roles+base, auth selectors, baseline mode); passwords → `secrets.json` (gitignored).

The worked example to copy from: **[projects/nhapoa/](projects/nhapoa/README.md)**.

## 2. Phase 0 — dump the design truth (assistant, via Figma MCP → `inputs/`)
- `figma-frames.json` — one entry per frame `{node_id, name, heading, kind}`. **`heading` = the frame's
  rendered H1/title** — powers the mapping gate (step 5). *Don't skip it.*
- `tokens.json` — `{colors, radii, fontSizes, fontFamilies}` (or export from Figma variables → baseline
  mode `derived`; or `internal` to skip and derive from the build).
- `captures/figma/<SLUG>.png` — design-frame screenshots for the side-by-side boards.
Deep-dive: `~/.claude/skills/design-qc/references/figma-extraction.md`.

## 2b. Reuse the capture bundle (skip if this portal has never been captured)
Every live capture writes `out/capture-bundle.json` — one row per screen, carrying a structure
hash (did the DESIGN change?) and a geometry hash (did the LAYOUT move?), plus a build fingerprint
per host. A later run consults it before opening a browser:

```bash
cd tools/design-audit
python3 engine/run.py --project <name> --phase bundle    # tier 0: freshness check, reuses what's unchanged
```

`out/freshness.md` records the decision and is a **gate**: it FAILs when a reused screenshot's
`pngSha256` no longer matches the file on disk. `--force` ignores the bundle and re-captures
everything; `--verify` always runs the per-screen structure/geometry check even when the build
fingerprint looks unchanged. `resolve_freshness` never guesses `reuse-all` on doubt — an
unreachable host, a missing or unreadable fingerprint, an empty host list, or an unreadable
`capturedAt` all fall back to `verify` or `full`.

Route discovery is **monotonic**: a route recorded for a role in the previous bundle is always
re-visited this run too (honouring `skipRoutes`), because a slow-loading nav widget makes the
discovered route set flaky. A route that still fails to load after one extra attempt is logged
(`navigation failed … screen NOT captured`) and named in a per-role `n screen(s) not captured: …`
summary — it is never silently backfilled from the previous bundle.

Modal/sub-states no menu reaches are declared in `projects/<name>/screen-manifest.yaml` and driven
by `engine/drive.py` — see `.claude/rules/design-audit.md`. Submission inside a flow is gated
**twice**: `environment` (in the manifest or `audit.config.json`) must resolve to `dev` or `uat`
(case-insensitive), **and** the flow's own `allowSubmit` must be the literal boolean `true` — a
YAML string like `allowSubmit: "false"` does not open the gate. Undeclared `environment` fails
SAFE to `prod` (loudly), never to the more permissive `dev`. A `captureValidation` step never
auto-clicks a destructive label (submit/approve/save/…) while that gate is closed; it logs and
skips the step, and its automatic click only ever tries the flow's explicit `submitLabel` or
`"Next"`.

**What a closed gate does and does not do.** Nothing prompts, halts or waits for a human. On
`prod` a flow still navigates to its entry, still runs its `fill` steps against the **live** form,
and still clicks any label that does not match `DESTRUCTIVE` — only destructive clicks are refused
and logged. Run a flow against `prod` only if filling its form with fixture data is itself
acceptable. The refusal is applied **twice** per click, because Playwright resolves a button name
by case-insensitive substring: once against the label the step declared, and again against the
accessible name of the element that label actually resolved to — otherwise `"Next"` passes the
gate and then clicks `"Save & Next"`. A forward `click:` that does not happen **aborts the rest of
the flow**, so no later step can file the unmoved page under the next screen's name.

`reuseRecord` records the identifier a successful submission produced. It stops the next run
**re-harvesting** one — it does not stop a second submission, because nothing navigates to or
edits the recorded record. The thing that actually prevents a second submission is `should_replay`
skipping a flow whose entry screen is byte-identical to the previous run's.

## 3. Capture the live build (assistant)
```bash
cd tools/design-audit
python3 engine/run.py --project <name> --phase all      # capture + analyze + report
```
Per role it logs in **once** (keep-alive, sessionStorage-safe), discovers sidebar routes, scroll-unclips
each page, screenshots at 1440-wide, and extracts every element's computed CSS. Modal/sub-states that no
menu reaches (a "Change" button, a case-detail tab, a confirm dialog) are captured by **driving** the UI —
see `references/capture-and-auth.md`. Never fire a real OTP or commit a destructive action on dev.
Admin logins often share a rate-limiter: capture all roles in one pass; retry a failed role after a
full quiet cooldown.

## 4. Coverage — did we reach every screen?
`out/coverage-ledger.json`: every Figma frame is `MAPPED` or `UNMAPPED`. **Any `UNMAPPED` = a missed
screen → the coverage gate FAILs.** `EXTRA` = build-only screens (fine; route to the Suggestions doc).

## 5. Mapping — is each build shot on the *right* frame?
```bash
python3 engine/crosscheck.py --master projects/<name>/out/audit-master.json --project projects/<name>
```
Compares **rendered titles**: design frame H1 (from step 2) vs live H1 vs the intended screen.
Disagreement → **MISMAP** (gate FAIL). Reads the rendered title, not the layer name. Output:
`out/crosscheck.md`. **Ship only when not FAIL.** Screens audited against a *reference* frame (another
screen's design reused as the visual language) carry `_refFrame` so this tier is skipped for them.

## 6. Findings — machine + judgment
- **Machine (🤖):** `analyze.py` checks every element's colour/type/radius/spacing vs the baseline →
  a deviation list + **DS-adoption %**.
- **Judgment (👤-proposed):** the assistant authors Tier-B findings from the DESIGN vs BUILD boards
  (right component? hierarchy? icon metaphor? empty/error state?), curated against the learning ledger.
- **Severity + category:** recalibrate every finding against `references/rubric.md` + GIGW/WCAG — severity
  is a rubric function, not a keyword guess (see the ledger's Canonical playbook §C/§D). Order
  severity-first, then top-to-bottom.
- **Global consolidation:** shared elements that repeat (accessibility bar, masthead, page header, tables,
  pagination, chips, sidebar, cards, chart palette, KPI scale, icons, notifications) collapse into ONE
  **Global** section spanning citizen + admin, each tagged **Scope: Global** and worded "applies to every
  screen with this element." Drop the per-screen repeats; keep genuinely screen-specific ones. Freeze
  each Global finding's published ID so it never re-maps.

## 7. Review in Figma + build the curated deliverables
The assistant builds the **3-column DESIGN | BUILD | ISSUES review sheet** (deliverable 4) with plain-
language draft issues. **👤 you** edit the issues, then say **"sync from Figma"** — the assistant reads
your edits (via `get_metadata`) and regenerates:
- the **curated per-screen PDF** (deliverable 2) and the **master Excel tracker** (deliverable 3), and
- re-runs the mapping cross-check.

The curated report is driven by the project's **source-of-truth script** — copy the NHAPOA pattern:
`projects/<name>/build_final_report.py` (the `SCREENS` list + geometry via `qc_geometry`) plus a verbatim
`sync_data.py` (the reviewer's issues text). Running it regenerates the PDF (via the fixed, project-agnostic
`generate_pdf.py` — never hand-roll the layout), the tracker, and the mapping gate. Details:
`references/figma-report.md` + `references/sync.md`.

> **Gotcha:** the inline PDF render can time out / leave a stale PDF. After regenerating, verify the PDF
> byte size CHANGED + mtime is fresh + rasterize a page; if not, run `generate_pdf.py` directly.

## 8. Pinned Figma report (optional — draggable pins) 
For a design-team-grade artifact the reviewer can fine-tune, the assistant builds deliverable 5: per
screen, a navy header + severity chips, a **DESIGN | BUILD board** with **numbered pins** (component
instances the reviewer drags), a Figma-frame/Live link, and Finding-Card instances. Reuse the file's
component kit (`Pin/*`, `Finding Card`, badges) and **harvest image hashes from the review sheet** (no
re-upload). Each screenshot sits in a **white rounded card on a light-gray panel** (match the
`findings-screen-ref` component — bare-on-white leaves "white patches"). NAME every frame you create.
After you drag pins, say **"sync from Figma"** to fold new positions back into `audit-master.json`.

## 9. Publish to Google Drive (👤 you, links preserved)
The assistant regenerates the local PDF + tracker. The Drive connector **cannot overwrite a fileId in
place**, so to keep your existing share links: in Drive, right-click each file → **Manage versions →
Upload new version** with the fresh local files. On a re-run, the assistant hands you a **row-level
changelog vs the live Drive copy** (it downloads the Drive file and diffs the tracker by ID, ignoring
dev-owned Status/Assignee/Date) so you update **only changed rows** and never clobber the developers'
status edits.

## 10. Correct a mapping / add a missed screen (👤 you, anytime)
Fix it in the Figma review sheet (repoint the "Figma frame ↗" link, or duplicate a row and fill
DESIGN/BUILD/ISSUES) and say **"sync"** — or just tell the assistant. Added screens land in
`inputs/manual-screens.json` (pure data, no code). The mapping gate re-runs to confirm. Full instructions:
**[projects/nhapoa/SYNC-GUIDE.md](projects/nhapoa/SYNC-GUIDE.md)**.

## 11. Human sign-off → CERTIFIED (👤 you)
The machine draft covers ~70%. A reviewer then confirms the flagged judgment calls; does the **keyboard +
screen-reader** a11y pass; checks **real data / Hindi-RTL / truncation**; signs **brand / emblem / GIGW**.
Only then does status flip from `MACHINE-DRAFT` to `CERTIFIED` — the renderer refuses to certify while any
👤 finding is unsigned. Why: `HOW-IT-WORKS.md`.

## 12. Re-run after fixes
Just ask again ("re-run the `<portal>` audit"). It re-captures, re-checks every element, and you compare
the new DS-adoption % and finding counts.

---

## The gates, at a glance (all must be green)
| Gate | File | Fails when |
|---|---|---|
| Coverage | `out/coverage-ledger.json` | a design frame has no live capture (missed screen) |
| Mapping | `out/crosscheck.md` | design title ≠ build title (wrong frame↔capture pairing) |
| Pins | `out/failures.md` | a pin falls outside its element ⊂ crop ⊂ image |
| Fresh PDF | file mtime/size | the PDF byte size is identical across runs (silently stale render) |
| Freshness | `out/freshness.md` | a reused capture no longer matches its recorded sha256 |

## The running principle — it learns every run
Before a run, read the ledger (`references/audit-rules.md`, Canonical playbook first); after, append every
correction and **turn any mechanizable mistake into one of the gates above** so it never recurs. Protocol:
`~/.claude/skills/design-qc/references/learning-loop.md`.
