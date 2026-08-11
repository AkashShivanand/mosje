---
description: Sync design tokens between the Figma UX4G DS and @mosje/tokens (DTCG → Style Dictionary). No Code Connect needed.
argument-hint: "[figma-file-url]  (defaults to the UX4G DS)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Sync MoSJE design tokens with Figma (no Code Connect — needs a Dev seat we don't have).

Target file: **${ARGUMENTS:-https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System}** (fileKey `3FF5l0SMNIwdpZrKkeyPTm`) — the canonical library named in `GOVERNANCE.md`.

> **Do not use `T3bkN5gNKfaNeY6dpT6FwF` or `qyzTEy8dlb3ssYctlkMX5o`.** Both are older SAMAVESH
> copies that still contain variables, so a sync run against either *appears* to work and
> silently edits a dead library. Corrected 2026-08-10 after this pointer sent an audit to the
> wrong file: `T3bk…` has 176 variables under `Color Styles` / `Text Styles` / `Misc`, and
> `qyzT…` has 261 with no `Theme` collection and the pre-rename `Blue - Light` / `Blue - Dark`
> modes. The canonical file has **899** variables across eight collections (2026-08-11).
> Check the count before you write.

> **A missing NAME is not a missing VARIABLE.** Renaming a variable in Figma preserves its
> id, so every binding follows it; deleting one detaches every binding and cannot be undone
> by re-creating the name, because the replacement gets a new id. A name-only diff — which
> is all `reference/figma-live.json` stores — renders those two identically. **Never conclude
> a variable was deleted from its absence in a name list.** Resolve the id with
> `figma.variables.getVariableByIdAsync(id)`: if it resolves, it was renamed. This is not
> hypothetical — on 2026-08-11 the neutral endpoints were renumbered by a two-step rename
> chain (`1000 -> 950`, then `1100 -> 1000`) and were reported as an unaccounted hard delete
> with unrecoverable bindings. Nothing had been lost. Capture ids *before* a write if you
> intend to verify one afterwards.

**Source of truth:** `packages/tokens/src/*.json` — DTCG JSON in 3 tiers:
`primitive.json` (raw palette/scales, private) → `semantic.json` (the public `--ds-*`/`--sa-*` contract, what apps consume) → `component.json` (resolves to semantic). Style Dictionary v4 compiles these into `tokens.css`, `tokens.ts`, the Tailwind v3/v4 outputs, and a **Figma DTCG export** (`packages/tokens/dist/figma.tokens.json`).
**Never edit generated files** (`packages/tokens/dist/`, `packages/design-system/tokens.css`, `packages/config/tailwind-preset.cjs`). Edit `src/*.json`, then `npm run build -w @mosje/tokens`.

## Figma → code (pull a Figma change into tokens)
1. **Pre-flight Figma MCP:** load the read tools and call `whoami`. If `net::ERR_FAILED`, the connector is down — ask the user to reconnect (the MCP bridges the desktop app; the file may need to be open), then retry.
2. **Extract current Figma values.** For the UX4G DS component pages (Buttons 2141:296705, Card 2141:296707, Badge 2141:296703, Alerts 2141:296701, …) use `get_design_context` (excludeScreenshot:true) on concrete coloured nodes + `get_variable_defs` for type/spacing. Heavy → delegate to a subagent (see `docs/research/figma-ux4g-ds.md`).
3. **Diff vs the contract.** Compare the extracted Figma values against the current DTCG `semantic.json` (resolve `primitive.json` references). Report changed / new / removed tokens for the user to approve. (For a quick machine diff, build first — `npm run build -w @mosje/tokens` — then compare the extracted values to `packages/tokens/dist/figma.tokens.json`.)
4. **On approval, edit `packages/tokens/src/primitive.json` / `semantic.json`** with the new values (keep the 3-tier structure + `$extensions.mosje.themes` for dark/hc/compact).
5. `npm run build -w @mosje/tokens` (regenerate all outputs) → `npm test -w @mosje/tokens` (asserts the backward-compatible `--ds-*` contract).
6. **Verify** `npm --prefix apps/dosje run build` stays green; spot-check a page if colours changed.
7. **Refresh the AI design context (required — `.claude/rules/design-system.md`).** If tokens/components changed: update `packages/design-system/design.md` (bump its `Last reviewed` date), `packages/design-system/AGENTS.md` if the inventory changed, and the matching SAMAVESH portal page(s) + `apps/docs/src/lib/nav.ts` (regenerates `/design-system/llms.txt`). Commit everything together.

## code → Figma (push token changes to the Figma library)
- The generated **`packages/tokens/dist/figma.tokens.json`** is a DTCG file. Import it into the Figma DS file via a Tokens-Studio-style plugin to update the Figma variables from code. (Manual/designer step; document the diff for them.)

## Notes
- Unresolved Figma semantics (Warning/Info are SVG-mask icons) won't surface via extraction — confirm those hexes with the user before changing them.
- MoSJE brand layer (saffron, gov-yellow, gov-navy) isn't in the UX4G atom DS — leave unless told otherwise.
- Portal DS (`u5eMCdX3a3mMZgnsHNn8XX`) is a separate sync for the portals.
- Component-level Code Connect: wire per `docs/research/figma-code-connect-readiness.md` when a Figma Dev seat is available.
