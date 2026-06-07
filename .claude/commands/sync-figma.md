---
description: Sync the code design tokens with the Figma UX4G DS — no Code Connect needed. Extracts Figma variables via the Figma MCP, drift-checks against tokens.json, and regenerates the token outputs.
argument-hint: "[figma-file-url]  (defaults to the UX4G DS)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Sync MoSJE design tokens **Figma → code** (no Code Connect — that needs a Dev seat we don't have).

Target file: **${ARGUMENTS:-https://www.figma.com/design/T3bkN5gNKfaNeY6dpT6FwF/MoSJE---UX4G-DS}** (fileKey `T3bkN5gNKfaNeY6dpT6FwF`).

Source of truth: `packages/design-system/tokens.json` → generates `tokens.css` + `tokens.ts` via `npm run build:tokens`. Mapping of our token names ↔ Figma variable names: `packages/design-system/figma-token-map.json`.

## Steps
1. **Read** `packages/design-system/tokens.json` and `figma-token-map.json`.
2. **Pre-flight Figma MCP:** load the Figma read tools (`get_metadata`, `get_design_context`, `get_variable_defs`) and call `whoami`. If it errors (`net::ERR_FAILED`), the connector is down — ask the user to reconnect, then retry. (The MCP bridges the Figma desktop app; the file may need to be open.)
3. **Extract current Figma values.** For each component page in the UX4G DS (Buttons 2141:296705, Card 2141:296707, Badge 2141:296703, Alerts 2141:296701, etc.), use `get_design_context` (excludeScreenshot:true) on a concrete colored node and harvest the resolved hex + bound variable name; use `get_variable_defs` for typography/spacing. Heavy → delegate to a subagent (see `docs/research/figma-ux4g-ds.md` for the proven extraction).
4. **Normalise** the extracted Figma values into a snapshot file at `/tmp/figma-snapshot.json` in tokens.json shape (`{ "color": {...}, "type": {...}, "radius": {...} }`), translating Figma variable names → our token keys using `figma-token-map.json`. Only include values you actually resolved.
5. **Drift check:** `node packages/design-system/check-drift.mjs /tmp/figma-snapshot.json`. Present the diff (changed / new) to the user.
6. **On approval:** `node packages/design-system/check-drift.mjs /tmp/figma-snapshot.json --write` then `npm --prefix packages/design-system run build:tokens` to regenerate `tokens.css` + `tokens.ts`.
7. **Verify:** `npm --prefix dosje run build` stays green; spot-check a page if colours changed. Commit.

## Notes
- Unresolved Figma semantics (Warning/Info are SVG-mask icons) won't appear in extraction — confirm those hexes manually with the user before changing `--ds-warning` / `--ds-info`.
- The MoSJE brand layer (saffron, gov-yellow, gov-navy) is **not** in the UX4G atom DS — leave those tokens as-is unless the user says otherwise.
- Portal DS (`u5eMCdX3a3mMZgnsHNn8XX`) is a separate sync for the portals.
- When a Figma **Developer seat** becomes available, also wire Code Connect per `docs/research/figma-code-connect-readiness.md`.
