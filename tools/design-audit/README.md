# design-audit — a project-agnostic design-vs-build QC engine

Audit **any** portal — Figma design vs the live build — and produce a reviewable report + a defect
tracker, with automatic gates that catch missed screens and wrong design↔build pairings. This README
is the **home page**: start here, then follow the map.

## 📚 Documentation map (start here)

**Run & operate — in this repo**

| Read this | When |
|---|---|
| **[USER-GUIDE.md](USER-GUIDE.md)** | You just want to run an audit (plain English, no setup). **Start here.** |
| **[AUDIT-A-PORTAL.md](AUDIT-A-PORTAL.md)** | The end-to-end manual: onboard → capture → review → correct/add → report + tracker → certify. |
| **[HOW-IT-WORKS.md](HOW-IT-WORKS.md)** | The model & architecture — the gates, why it never over-claims. |
| **[projects/_template/README.md](projects/_template/README.md)** | Onboard a **new** portal (copy the template, fill one config). |
| **[projects/nhapoa/README.md](projects/nhapoa/README.md)** | The worked example — a fully-audited portal you can copy from. |
| **[projects/nhapoa/SYNC-GUIDE.md](projects/nhapoa/SYNC-GUIDE.md)** | Correct a wrong mapping / add a screen the reviewer spotted, via the Figma sheet. |
| *This README* | The engine reference — config schema + manual commands. |

**The agent's playbook — the `/design-qc` skill** (`~/.claude/skills/design-qc/`, drives this engine)

| Read this | Covers |
|---|---|
| `SKILL.md` | The full pipeline the agent runs (Phase 0 → capture → gates → report → human track). |
| `references/learning-loop.md` | **The running principle:** read the ledger, fold every correction back, turn mistakes into gates. |
| `references/audit-rules.md` | The self-learning ledger — start with the **Canonical playbook** at the top (all lessons distilled), then the dated log. |
| `references/geometry-and-pins.md` · `figma-extraction.md` · `capture-and-auth.md` · `spec-comparison.md` · `functional-audit.md` · `figma-report.md` · `sync.md` · `rubric.md` | Deep-dives per phase. |

> New here? **[USER-GUIDE.md](USER-GUIDE.md)** to run it · **[AUDIT-A-PORTAL.md](AUDIT-A-PORTAL.md)** for the whole lifecycle · **[HOW-IT-WORKS.md](HOW-IT-WORKS.md)** to understand it.

---

One reusable engine. One config file per project. Works on **any** project — with a design
system, with only Figma, or with neither.

It answers two questions, honestly:

1. **Coverage (breadth):** was *every* screen and state audited? — a coverage ledger that
   unions Figma frames with live routes and **hard-fails on any `UNMAPPED` frame**.
2. **Conformance (depth):** does *every element* use the design system correctly? — every
   element's computed CSS is checked against a baseline, every run, producing a **DS-adoption %**
   and a deviation list. It does **not** trust design-system inheritance (developers may not be
   following it), so it re-verifies everything each time.

It never overclaims. The machine pass ships a **`MACHINE-DRAFT`** report with a 🤖/👤 stamp on
every finding; it **cannot** print `CERTIFIED` until a human signs the checks a machine can't judge.

---

## What AI does vs what a human must do

| Work | Owner | In the hour? |
|------|-------|------|
| Enumerate every screen/state, capture, extract every element | 🤖 machine | yes |
| Type / colour / spacing / radius / border vs tokens; presence; contrast; programmatic a11y | 🤖 machine | yes |
| Right component? hierarchy? icon metaphor? empty/error-state? | 🤖 proposes → 👤 confirms | flagged |
| Keyboard + screen-reader walkthrough, focus order, meaningful alt | 👤 human only | **no — async** |
| Real data, Hindi/RTL, truncation, missing translations | 👤 human only | **no — async** |
| Brand/emblem/GIGW mandatory elements, severity calibration, final sign-off | 👤 human only | **no — async** |

Machine pass ≈ **40 min/portal**, unattended, repeatable. Human sign-off is a separate track
(~2-3 reviewer-hours the first time; less as design-system adoption rises).

---

## Layout

```
tools/design-audit/
  engine/            reusable core — never edit per project
    run.py           orchestrator (capture → analyze → report)
    capture.py       keep-alive login per role, scroll-unclip, screenshot@width, extract computed CSS
    analyze.py       coverage ledger + pluggable baseline + per-element conformance + audit-master.json
    crosscheck.py    design↔build MAPPING gate — rendered-title match catches missed screens + wrong pairings
    report.py        MACHINE-DRAFT / CERTIFIED PDF+HTML with 🤖/👤 stamps, coverage + DS-adoption tiles
    qc_geometry.py   assertion-gated pin/crop geometry (a pin must sit inside its element+crop+image)
    render.js        HTML → PDF (puppeteer, one dynamically-sized page per screen)
    bundle.py        capture-bundle.json — structure/geometry hashes, freshness tiers, masking
    drive.py         executes projects/<name>/screen-manifest.yaml — wizard steps a route-crawl can't reach
    manifest.py      parses + validates screen-manifest.yaml
    figures.py       derives web-servable WebP report figures for apps/hub/public/reports/<name>/
  projects/<name>/   per project — the ONLY thing you write
    audit.config.json      figma/live/auth/roles/baseline (no passwords)
    secrets.json            gitignored — passwords keyed by role
    screen-manifest.yaml    optional — declarative flows/wizard steps for engine/drive.py
    inputs/                 figma-frames.json (with a `heading` per frame!), tokens.json, manual-screens.json
    captures/               live screenshots + extracted rows (generated, gitignored)
    out/                    coverage-ledger.json, conformance.json, crosscheck.md, failures.md,
                             freshness.md, capture-bundle.json (tracked), audit-master.json (tracked)
```

`--phase bundle` (tier 0) checks `out/freshness.md` and reuses what's unchanged before opening a
browser; `--phase capture`/`all` always captures, tier-1-deciding per screen. `--phase figures`
derives the report's WebP figures. See `AUDIT-A-PORTAL.md` §2b for the freshness gate and how
submission inside a manifest flow is gated by `environment` + `allowSubmit`.

## Five deliverables, three gates

All five come from one `audit-master.json` (full table + who-makes-what in
**[AUDIT-A-PORTAL.md](AUDIT-A-PORTAL.md)**):
1. **Machine draft** (`engine/report.py`, run by `run.py`) — the fast, honest `MACHINE-DRAFT` PDF/HTML.
2. **Curated per-screen PDF** (per-project `build_final_report.py` → the fixed `docs/qc/portals/<p>/generate_pdf.py`).
3. **Master Excel tracker** (one row per finding + a **Scope** column; lockstep with the PDF).
4. **Editable Figma review sheet** (3-column DESIGN|BUILD|ISSUES you edit → say "sync from Figma").
5. **Pinned Figma report** (draggable numbered pins + finding cards, styled to the `findings-screen-ref` component).

Publish to **Google Drive** by uploading each fresh file as a **new version** (the connector can't
overwrite a fileId in place) — on a re-run, get a row-level changelog vs the live Drive copy so only
changed rows are updated. Full flow: **[projects/nhapoa/SYNC-GUIDE.md](projects/nhapoa/SYNC-GUIDE.md)**.

**Gates that must be green before you trust a run:**
1. **Coverage gate** (`coverage-ledger.json`) — every design frame matched to a live capture; `UNMAPPED` = a missed screen → FAIL.
2. **Mapping gate** (`crosscheck.md`, `engine/crosscheck.py`) — the design frame's **title** must match the live capture's **title**; a build screenshot on the wrong frame (or vice versa) → **MISMAP** → FAIL. Needs a `heading` per frame in `inputs/figma-frames.json`.
3. **Pin gate** (`failures.md`, `qc_geometry.py`) — every pin sits inside its element ⊂ crop ⊂ image; misses → FAIL. Ship only when empty.

**The learning loop** (a running principle, not optional): read the ledger before, fold every
correction back after, and **turn any mechanizable mistake into one of the gates above** so it can't
recur. Full protocol: `~/.claude/skills/design-qc/references/learning-loop.md`.

## Run

```bash
cd tools/design-audit
python3 -m playwright install chromium        # once
npm i puppeteer-core pdf-lib                   # once (in engine/, for the PDF)

# Phase 0 (agent, in a Claude session): dump Figma via MCP into projects/<p>/inputs/
#   figma-frames.json  [{node_id,name,role,screen,state}]
#   tokens.json        {colors:[…],radii:[…],fontSizes:[…],fontFamilies:[…]}
#   captures/figma/<SLUG>.png   (optional design frames for side-by-side boards)

cp projects/nhapoa/secrets.example.json projects/nhapoa/secrets.json   # fill passwords
python3 engine/run.py --project nhapoa --phase all        # capture + analyze + report
# or, iterating on existing captures:
python3 engine/run.py --project nhapoa                    # analyze + report only
```

## Onboard a new project = write one config

```json
{
  "project": "myapp", "portal": "My App", "idPrefix": "MYA",
  "figma": { "fileKey": "…", "rootNode": "1:2", "framesFile": "inputs/figma-frames.json",
             "tokensFile": "inputs/tokens.json", "urlTemplate": "https://figma.com/design/…?node-id={node}" },
  "capture": { "width": 1440, "dpr": 2, "waitMs": 1800 },
  "live": {
    "auth": { "type": "form", "loginPath": "/login", "userField": "#email", "passField": "#password",
              "submit": "button[type=submit]", "loginMarker": "/login" },
    "roles": [ { "name": "public", "base": "https://app.example.com", "auth": "none" },
               { "name": "admin",  "base": "https://app.example.com", "user": "admin@example.com" } ],
    "skipRoutes": ["/login", "/logout"]
  },
  "baseline": { "mode": "tokens", "source": "inputs/tokens.json" }
}
```

### Baseline modes (pluggable — degrades gracefully)
- **`tokens`** — diff every element against `inputs/tokens.json`. Strictest; catches dev drift.
- **`derived`** — same, but the token set is exported from the Figma variables (`get_variable_defs`).
- **`internal`** — no baseline: derive the de-facto system from the build and flag statistical
  outliers. Use when a project has no design system at all.

## The honesty contract
- Every finding is stamped **🤖 machine** or **👤 human**.
- The cover shows **DS-adoption %**, **frames covered / UNMAPPED**, **build-only**, and the **coverage gate**.
- Status is **`MACHINE-DRAFT`** until the human gates are signed; the renderer refuses to print
  `CERTIFIED` while any finding is still 🤖-only. A fast report is never mistaken for a compliance cert.
