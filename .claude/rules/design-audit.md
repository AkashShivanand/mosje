# Design-vs-build QC — use the shared engine

When asked to audit / QC / verify a build against its Figma design (fidelity, tokens, coverage,
"looks wrong"), invoke the **`/design-qc`** skill. The skill is the brain (Figma MCP, judgment
findings, the self-learning `audit-rules.md`, the human-review track); it **drives the reusable,
config-driven engine** at:

    tools/design-audit/

The engine does the deterministic half: enumerate → **coverage ledger + hard-fail gate**, a
**design↔build mapping cross-check** (`engine/crosscheck.py` — catches missed screens + build↔Figma
mis-pairings by comparing rendered titles), keep-alive per-role capture + computed-CSS extraction,
**per-element DS-conformance** vs a pluggable baseline (`tokens|derived|internal`) → **DS-adoption %**,
assertion-gated pins, and a **MACHINE-DRAFT** report (🤖/👤 stamped; cannot self-certify as WCAG/GIGW).

**Running principle — the audit learns every run** (`references/learning-loop.md`): read
`references/audit-rules.md` before, fold every correction back after, and **turn any mechanizable
mistake into a gate** (missed screen → coverage ledger; wrong pairing → cross-check; off pin →
`qc_geometry` assertion). Ship only when `out/failures.md` is empty AND `out/crosscheck.md` is not FAIL.
Phase 0 must dump a **`heading` per frame** in `inputs/figma-frames.json` (powers the mapping gate).

- One config per portal: `tools/design-audit/projects/<name>/audit.config.json` (NHAPOA, TG exist).
- Onboard a new portal = copy `projects/_template/` and fill the config (`projects/_template/README.md`).
- **Do NOT** re-create per-portal copies of the engine's *deterministic* scripts (analyze / conformance /
  crosscheck / the MACHINE-DRAFT report) — the old `docs/qc/portals/*/engine/` copies are deprecated
  (each carries a `DEPRECATED.md`) in favor of the engine.
- **Two things ARE legitimately per-portal, not drift:** (1) **interactive capture drivers** in
  `projects/<name>/*.py` (e.g. TG's `citizen_apply.py`, `capture_flows.py`, `capture_dm_modals.py`) — the
  engine's declarative route-crawl can't reach button-driven states (OTP flows, multi-step wizards, modal
  open-states), so these drivers are expected; they log in keep-alive, drive the flow with dummy data, and
  never commit destructive actions. (2) The **curated human report** = `projects/<name>/build_final_report.py`
  (+ `sync_data.py` when a reviewer sheet is synced) which renders the polished PDF into
  `docs/qc/portals/<name>/` via a COPY of the canonical `generate_pdf.py` + `render.js` (the skill's
  `scripts/` are canonical — copy, never fork; fold generator improvements back to the skill).
- Run: `cd tools/design-audit && python3 engine/run.py --project <name> --phase all`.
