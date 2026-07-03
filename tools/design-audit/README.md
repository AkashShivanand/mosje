# design-audit — a project-agnostic design-vs-build QC engine

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
    report.py        MACHINE-DRAFT / CERTIFIED PDF+HTML with 🤖/👤 stamps, coverage + DS-adoption tiles
    qc_geometry.py   assertion-gated pin/crop geometry (a pin must sit inside its element+crop+image)
    render.js        HTML → PDF (puppeteer, one dynamically-sized page per screen)
  projects/<name>/   per project — the ONLY thing you write
    audit.config.json      figma/live/auth/roles/baseline (no passwords)
    secrets.json           gitignored — passwords keyed by role
    screen-manifest.yaml   escape hatch: frame → {url, deeplink, seed, trigger}
    inputs/                figma-frames.json, tokens.json, design PNGs (agent-provided, Phase 0)
    captures/              live screenshots + extracted rows (generated)
    out/                   coverage-ledger.json, conformance.json, audit-master.json, report.pdf
```

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
