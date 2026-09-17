---
name: figma-page-organiser
description: Organise a Figma handoff page of portal screens into the estate-wide handoff structure — zones A Start Here / B Screens by User Role / C Shared Building Blocks / D Archive, one column per user role, flows with fixed role-scoped IDs (NGO 30), branches only where a flow splits, Desktop / Mobile / Dialogs rows with phone frames under their desktop frame, grey by depth, red plus a note for flows pending discussion, a generated and linked Portal Map, and a layers panel in reading order. Use when a portal page in a handoff file (MoSJE Portal [Handoff], the E-Anudaan file, or a new portal) is scattered, unnumbered, mis-coloured, or needs setting up. Requires the figma-use skill and Figma MCP tools.
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
---

# Figma page organiser (MoSJE handoff structure)

**The standard is `.claude/rules/figma-handoff-page-structure.md`. Read it first; this skill is the
procedure.** Where they disagree, the rule wins and this file is fixed.

- Worked example: `docs/design-handoffs/E-Anudaan-Handoff-Page.md` (E-Anudaan, 17 Sep 2026)
- Layout code to paste into `use_figma`: `tools/figma-handoff-structure/layout-engine.js`
- Gate: `npm run check:figma-handoff` (REST — costs no MCP calls)

**Prerequisites:** load `figma-use` before any `use_figma` call; batch-load Figma tool schemas in one
`ToolSearch select:` call; read `.claude/rules/figma-call-budget.md`. E-Anudaan (263 frames) took
**11 writes**: 1 skeleton + 1 lane, 2 for the other lanes, 1 filing late additions, 1 layout, 1 notes,
1 guide, 1 re-layout, 2 fixes. Plan for that, not for "a few".

## 1. Measure and capture the before — free
```bash
npm run check:figma-handoff -- --portal <Portal> --fresh --verbose
```
Not registered? Add it to `tools/figma-handoff-structure/pages.json` and `--update-baseline`.
Render the **before** picture over REST (`/v1/images`, scale ≥ 0.01 — lower returns 400) for every
top-level section, and compose them at their canvas positions. It cannot be reconstructed later.

## 2. Inventory every frame — free
Walk the page over REST one SECTION level at a time and list every frame with its parent. Every frame
must end up somewhere; count them before and after.

**Re-read immediately before the first write.** On E-Anudaan four groups were added by other sessions
between the inventory and the move; a script that deletes "empty" old sections would have hit them.
Delete an old container **only** when the same script confirms `children.length === 0`, and file
whatever is left.

## 3. Decide the tree — write it down
- **Role columns:** `Everyone · Sign In & Account` first, then user roles in the order a case meets
  them. Ground roles in the code (`find apps/hub/src/app/portals/<slug> -name page.tsx`; route groups
  map to screen prefixes) and the recon (`docs/research/<host>/INVENTORY.md`). >9 flows → split by phase.
- **Flows:** role code + tens (`OFFICER 20`), dependency order. Existing leaf sections become flows or
  branches by **re-parenting** (keeps node ids and links) — do not rebuild them.
- **Branches:** only where the flow forks.
- **Pending discussion:** only flows with a *documented* open question — the portal's questions list or
  a recorded decision awaiting sign-off. Collect each question's reference and what is drawn for now.
  Never mark something pending on a hunch.

## 4. Move — `buildLane` from the engine, 2–3 columns per call
Zones first (`ensure(page, "A · START HERE")` …), then `buildLane(B, {name, flows})` per column, C and D
groups, archive frames `opacity = 0.4`, strays prefixed `.stray / `. `rows()` sorts each flow's screens
into Desktop / Mobile / Dialogs by name.

## 5. Pending notes
For each pending flow: append ` · Pending Discussion` to its name and add a `.note / Pending Discussion`
auto-layout card (1440 wide, Noto Sans; title, one-line lead, then per question `Ref · question` and
`For now: …`). **Nested auto-layout frames default to a white fill — clear them**, or every question
sits on a white stripe.

## 6. Colours — bind to SAMAVESH by NAME from the library
```js
const cols = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
// collection "Color" in library "SAMAVESH Design System" → getVariablesInLibraryCollectionAsync → importVariableByKeyAsync
```
Names that exist: `text/neutral/bolder`, `text/neutral/subtle`, `text/brand/primary/base`,
`bg/neutral/base`, `bg/neutral/subtlest`, `text/status/error/bolder`, `border/status/error/base`,
`bg/status/error/subtler`. Guessing names (`text/neutral/default`, `text/danger`) silently matches
nothing — and a loose regex matched `text/neutral/inverse` (white) on the first attempt. Check names in
`packages/tokens/reference/figma-live.json` → `Color` first. The canvas greys are specimens of the
page ramp and stay literal.

## 7. Layout — one call for the whole page
`layoutSection(zone, 1, false, ORDER, BR, "B · SCREENS BY USER ROLE")` per zone, then place A at (0,0),
B below, C and D to the right, `reorder(page, [A, B, C, D])`. A group in C that holds both a note and
screens needs its screens pushed below the note by hand (the engine handles notes only in sections
with sub-sections).

## 8. Zone A — generated from the canvas
Read the role columns and flows from B in the same script and build Cover, Portal Map (flow boxes with
`hyperlink = {type: "NODE", value: flow.id}`, pending boxes red), How to Read This Page, Status &
Change Log (pending list linked). Never type the flow list by hand.

## 9. Verify — at the scale a person reads it
- `npm run check:figma-handoff -- --portal <Portal> --fresh --strict` and `--selftest`.
- REST renders: the Portal Map at ≥0.35, one pending note at 0.5, one pending flow, each zone. **Look at
  them**: white stripes, clipped text, a note over screens, a legend that does not match.
- Compose the after picture; record the snapshot (`manifests/<portal>.json`) from a fresh REST read —
  filter the cache to the newest files, older cached batches hold the pre-move tree.
- `--update-baseline`; update `docs/design-handoffs/<Portal>-Handoff-Page.md`.

## 10. Hand over what the API cannot do
Say it in the summary, every time: **name a version** (`saveVersionHistoryAsync` is not supported),
**confirm stray deletions**, **run the timed find test**.

## Plugin API gotchas
- `SECTION` children use coordinates relative to the section. Re-parented nodes keep their old relative
  x/y, which is why the layout pass sorts frames by `(floor(y/1000), x)` on its first run.
- The layers panel lists the LAST child first: re-insert children with `insertChild(0, c)` in reading order.
- Never walk a whole page generically — recurse into `SECTION`s only; screen frames are leaves.
- Page context resets every call → `setCurrentPageAsync` at the top of each script.
- `node.children` is read-only → copy before sorting.
- Heavy frames time out full text scans → bounded top-band DFS only.
- A failed call rolls back everything in it. After an error, re-read before assuming anything landed.
