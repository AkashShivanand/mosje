# How it works — the model & architecture

For maintainers. Home + all docs: **[README.md](README.md)**. User-facing flow: **[USER-GUIDE.md](USER-GUIDE.md)**.
Full lifecycle manual: **[AUDIT-A-PORTAL.md](AUDIT-A-PORTAL.md)**. This doc explains *why* it's built
this way, so changes don't erode the guarantees.

---

## The core idea: two gates, honestly labelled

A design audit has to answer two independent questions. Conflating them is what made earlier ad-hoc
audits miss things.

1. **Coverage (breadth) — did we look at every screen/state?**
   The engine builds a **coverage ledger** by unioning the Figma frames (design truth) with the live
   routes discovered at capture (build truth). Every row is `UNMAPPED` until a live capture is matched
   to it. **Any `UNMAPPED` row fails the coverage gate.** The auditor can no longer silently decide
   what "everything" is — the denominator is machine-generated.

2. **Conformance (depth) — does every element use the design system correctly?**
   For every captured screen, every element's computed CSS is checked against a **baseline** (the
   token contract). Deviations are consolidated and counted; the headline is **DS-adoption %**.
   Crucially, this runs **every element every run** — it does **not** trust that a component is correct
   just because it's a design-system component. Developers override things; inheritance can't be
   trusted, so we verify instances. That's also why it doubles as a DS-adoption enforcement metric.

3. **Mapping (are the pairings right?) — is each build shot on the *right* frame?**
   Coverage says a frame was reached and conformance measures the pixels, but neither notices when a
   build screenshot is paired with the **wrong Figma frame** (or vice versa) — that just yields
   plausible-but-wrong findings. `crosscheck.py` compares **rendered titles**: the design frame's H1
   (from `inputs/figma-frames.json` → each frame's `heading`) vs the live capture's H1 vs the screen we
   *think* we're auditing. Design≠build title → **MISMAP** (gate FAIL); title≠screen → **CHECK**. It
   reads the rendered title, not the layer name, so it correctly passes mislabeled frames. This closed
   the "wrong pairing / missed flow" class of mistakes that used to need a human eye.

## Why it never over-claims (MACHINE-DRAFT vs CERTIFIED)

Automated checks (token diffs, contrast, programmatic axe) catch maybe ~70% of what matters and
**none** of the experiential accessibility, localization, or brand judgment. So:

- Every finding is stamped **🤖 machine** or **👤 human**.
- The report ships as **`MACHINE-DRAFT`** and the renderer **refuses to print `CERTIFIED`** while any
  👤 finding is unsigned (`report.py`). A fast report can never be mistaken for a compliance cert.
- The ~1-hour machine pass is the repeatable part; the human sign-off is a separate, honest track.

## The AI ⇄ human split (what lives where)

- **Deterministic engine (this tool):** enumerate → coverage ledger, capture + computed-CSS extract,
  per-element conformance + DS-adoption, assertion-gated pins, MACHINE-DRAFT report. Same result every
  run; no judgment.
- **Agent / `/design-qc` skill (the brain):** Figma MCP dump (Phase 0), Tier-B judgment findings
  (right component? hierarchy? icon metaphor?), curation against the self-learning `audit-rules.md`,
  and orchestrating the human sign-off track. Only the agent can do MCP + judgment.

## Certify the design system once (the scaling model)

Across many portals on one shared design system, don't re-do the expensive human certification per
portal. Certify each **component** once (accessibility, localization, brand) at the design-system
level; portals inherit it. Then each portal's fast pass is just **integration conformance**: did it
use the certified components correctly (composition), do all screens exist (coverage), and a thin
human content sample. Track **DS-adoption %** as the trust dial — when it drops, fix the design
system, don't lengthen the audit. (Today the engine assumes low adoption and verifies every element,
which is the safe default.)

## The learning loop (why it gets better, not just repeats)

The audit is **self-improving by design**. Before a run the agent reads the ledger
(`references/audit-rules.md`); after a run it appends every correction as a dated rule **and escalates
any mechanizable mistake into a gate** — a missed screen becomes a coverage-ledger row, a wrong pairing
becomes a `crosscheck.py` MISMAP, an off pin becomes a `qc_geometry` assertion. The rule: a correction
that *can* become an assertion **must**, so the human never catches it twice. This is what keeps the
audit trustworthy as it scales across portals instead of relearning the same lessons. Full protocol:
`~/.claude/skills/design-qc/references/learning-loop.md`.

## Pluggable baseline (works on any project)

The conformance check reads an "allowed values" set from whichever source exists — so the same engine
runs on a token-driven estate, a Figma-but-no-tokens app, or a legacy app with no design at all:

- **`tokens`** — strict, vs a hand-provided `inputs/tokens.json`.
- **`derived`** — same, but exported from Figma variables via `get_variable_defs` (no hand-writing).
- **`internal`** — no baseline: derive the de-facto system from the build, flag statistical outliers.

## Geometry (why pins never land wrong)

`qc_geometry.py` derives every crop and pin from the **real element box** against the **real capture
height**, then **asserts** each pin sits inside its element ⊂ crop ⊂ image. Misses are written to
`out/failures.md`; ship only when it's empty. This killed the recurring "pin on the sidebar" bug.

## Data flow

```
Phase 0 (agent, MCP)      inputs/figma-frames.json · inputs/tokens.json · captures/figma/*.png
        │
capture.py  ── per role: keep-alive login (sessionStorage-safe) → route discovery →
        │      scroll-unclip → full-height screenshot@1440 → computed-CSS rows
        ▼
analyze.py  ── coverage ledger (union + gate) · baseline · per-element conformance (DS-adoption %)
        │      · assemble audit-master.json · qc_geometry pins + assertion gate
        │      · crosscheck.py → design↔build mapping gate (out/crosscheck.md; FAIL on MISMAP)
        ▼
report.py   ── MACHINE-DRAFT PDF/HTML (🤖/👤 stamps, coverage + DS-adoption tiles) via render.js
```

## Files

```
engine/
  run.py         orchestrator + self-install preflight (chromium + PDF deps)
  bootstrap.py   plain-request → config + gitignored secrets + AUTO-DETECTED login selectors
  capture.py     keep-alive capture + scroll-unclip + computed-CSS extraction
  analyze.py     coverage ledger + baseline + conformance + audit-master assembly
  crosscheck.py  design↔build mapping gate (rendered-title match; FAILs on MISMAP)
  report.py      MACHINE-DRAFT/CERTIFIED report; refuses to certify with unsigned 👤 findings
  qc_geometry.py assertion-gated pin/crop geometry
  render.js      HTML → PDF (puppeteer)
projects/<name>/ audit.config.json · secrets.json (gitignored) · inputs/ · captures/ · out/
projects/_template/  copy-to-onboard
```

## Extending it

- **New project:** `bootstrap.py` (or copy `projects/_template/`), then agent does Phase 0 + `run.py`.
- **New check dimension:** add to the rubric in `analyze.py` (machine) or as a Tier-B/C human cell.
- **Side-by-side design panels:** drop design frames into `captures/figma/<SLUG>.png`; the report
  renders DESIGN vs BUILD automatically.
- **CERTIFIED workflow:** add human sign-off fields to `audit-master.json` findings (`check: "👤 …"`,
  `signed_by`, `signed_at`); the renderer already gates on them.
- **Nightly drift CI:** run the machine pass across projects on a schedule; gate merges on
  composition + Tier-A regressions only (never assert compliance from a machine pass).

## Provenance / not-yet-built (known gaps)

- No re-certification/expiry triggers yet (a token or WCAG change should re-open affected rows).
- No signed, commit-stamped attestation trail yet (needed for a real compliance artifact).
- Design-side side-by-side panels + the `derived`-from-Figma auto-export are partially wired.
