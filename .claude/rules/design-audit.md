# Design-vs-build QC — use the shared engine

When asked to audit / QC / verify a build against its Figma design (fidelity, tokens, coverage,
"looks wrong"), invoke the **`/design-qc`** skill. The skill is the brain (Figma MCP, judgment
findings, the self-learning `audit-rules.md`, the human-review track); it **drives the reusable,
config-driven engine** at:

    tools/design-audit/

The engine does the deterministic half: enumerate → **coverage ledger + hard-fail gate**, keep-alive
per-role capture + computed-CSS extraction, **per-element DS-conformance** vs a pluggable baseline
(`tokens|derived|internal`) → **DS-adoption %**, assertion-gated pins, and a **MACHINE-DRAFT** report
(🤖/👤 stamped; cannot self-certify as WCAG/GIGW).

- One config per portal: `tools/design-audit/projects/<name>/audit.config.json` (NHAPOA exists).
- Onboard a new portal = copy `projects/_template/` and fill the config (`projects/_template/README.md`).
- **Do NOT** re-create per-portal capture/author/report scripts — the old `docs/qc/portals/*/engine/`
  copies are deprecated in favor of the engine.
- Run: `cd tools/design-audit && python3 engine/run.py --project <name> --phase all`.
