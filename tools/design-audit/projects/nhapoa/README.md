# NHAPOA — worked example (a fully-audited portal)

The reference project. Copy its shape to onboard a new portal, or read it to see what a finished audit
looks like. **New to the tool?** Start at the engine home: **[../../README.md](../../README.md)** and the
manual **[../../AUDIT-A-PORTAL.md](../../AUDIT-A-PORTAL.md)** (the rules it learns by:
`~/.claude/skills/design-qc/references/audit-rules.md` — read the Canonical playbook first).

## Deliverables (what a finished audit produces)
| Artifact | Where |
|---|---|
| **Curated PDF report** (navy cover + severity tiles + per-screen DESIGN\|BUILD boards + pinned findings) | `docs/qc/portals/nhapoa/NHAPOA-…-Design-QC-Report.pdf` |
| **Master tracker** (one row per finding + **Scope** column) | `docs/qc/MoSJE-Portal-QC-Tracker.xlsx` → sheet `NHAPOA` (+ `Coverage – NHAPOA`, `Rollup`) |
| **Figma review sheet** (3-column DESIGN\|BUILD\|ISSUES, the editable surface) | Design-QC file (`LHVPBAQasYOqOK1ZYCiZFG`) → page `NHAPOA`, review root `445:1279` |
| **Pinned Figma report** (draggable numbered pins + finding cards) | same file → page `NHAPOA`, `REPORT` frame `645:289` |
| Machine outputs | `out/audit-master.json` · `out/crosscheck.md` · `out/failures.md` |

Current state: **84 screens · 151 findings** (1 Blocker · 9 Major · 128 Minor · 11 Nit; 14 tagged
Scope: Global) across 10 role groups; pin gate empty; mapping gate not-FAIL (0 mis-maps).

## Files in this project
| File | What it is |
|---|---|
| `audit.config.json` | Portal config — figma file, live roles + bases, form-login selectors, baseline. |
| `secrets.json` | **gitignored** — passwords keyed by role. Copy `secrets.example.json` to create. |
| `inputs/figma-frames.json` | Frame inventory `{node_id, name, heading}` — the `heading` powers the mapping gate. |
| `inputs/manual-screens.json` | Drop-in screens you added/corrected via the sheet (pure data — see SYNC-GUIDE). |
| `inputs/tokens.json` | Token baseline (colours / radii / font sizes / families). |
| **`build_final_report.py`** | **The one source of truth** → regenerates `audit-master.json`, the curated PDF **and** the tracker, and runs the mapping gate. Holds the pinned-screen findings + the Global section + the severity/category calibration. |
| `sync_data.py` | The reviewer's synced issues (verbatim) + per-screen design/build image + node map for the sheet-driven screens. |
| `captures/` | Live screenshots (`live/`, `citizen/`, `details/`) + extracted rows + design frames (`figma/`). |
| **`SYNC-GUIDE.md`** | **How to correct a mapping or add a missed screen** via the Figma sheet. |
| `_archive/` | Superseded one-off run artifacts (Phase-A checklists, old drivers) — provenance only. |

## Regenerate the report + tracker
```bash
cd tools/design-audit/projects/nhapoa
python3 build_final_report.py      # writes audit-master.json, the PDF, the tracker; runs the mapping gate
```
After it runs: verify the PDF byte size changed + mtime is fresh + rasterize a page (the inline render
can silently leave a stale PDF; if so, run `docs/qc/portals/nhapoa/generate_pdf.py` directly).

## Correct / add screens · publish
- **Correct/add:** **[SYNC-GUIDE.md](SYNC-GUIDE.md)** — edit the Figma sheet (or tell the assistant) and
  say "sync"; it folds edits into the report + tracker and re-runs the mapping gate.
- **Pinned Figma report:** after you drag pins on the `REPORT` frame, say "sync from Figma" to fold the
  new positions back into `audit-master.json`.
- **Google Drive:** upload the fresh PDF + tracker as **new versions** (Manage versions) to keep the
  share links; ask for a row-level changelog vs the Drive copy so only changed rows are updated.
