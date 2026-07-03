# Onboard a new project (checklist)

1. Copy this folder: `cp -r projects/_template projects/<slug>`
2. Fill `audit.config.json` — portal name, idPrefix, Figma fileKey/rootNode, live base URLs + auth
   selectors, roles (usernames only), baseline mode.
3. `cp secrets.example.json secrets.json` (in the new folder) and fill role passwords. `secrets.json`
   is gitignored — never commit it. (Copy `../nhapoa/secrets.example.json` if this template lacks one.)
4. **Phase 0 (agent, via Figma MCP):** produce
   - `inputs/figma-frames.json` — `[{node_id, name:"Role/Screen/State", state}]` from `get_metadata`
   - `inputs/tokens.json` — `{colors,radii,fontSizes,fontFamilies}` from `get_variable_defs`
     (or set `baseline.mode` to `internal` to skip and derive from the build)
   - `captures/figma/<SLUG>.png` — optional design frames for side-by-side boards
5. Run: `python3 engine/run.py --project <slug> --phase all`
6. Read `out/` — `coverage-ledger.json` (gate), `conformance.json` (DS-adoption + deviations),
   `…-MACHINE-DRAFT.pdf`.
7. Human track → CERTIFIED: confirm severities, keyboard + screen-reader a11y pass, Hindi/RTL content,
   brand/GIGW sign-off.

Baseline modes: `tokens` (strict, vs `inputs/tokens.json`) · `derived` (from Figma variables) ·
`internal` (no design system — flag statistical outliers).
