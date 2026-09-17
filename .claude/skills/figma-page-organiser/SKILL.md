---
name: figma-page-organiser
description: Organise a Figma handoff page of portal screens into the estate-wide handoff structure — zones A Start Here / B Journeys / C Build Reference / D Archive, user-role lanes as columns, stable tens-numbered flows (B2.30), device rows with phones under their desktop counterpart, state order by what the section varies on, fills by depth on the #E3E3E3→#C0C0C0 ramp, a layers panel in reading order, and a Start Here zone with cover, hyperlinked portal map, legend and change log. Use when a portal page in a handoff file (MoSJE Portal [Handoff], the E-Anudaan file, or a new portal) is scattered, unnumbered, mis-coloured, or needs setting up for a new portal. Requires the figma-use skill and Figma MCP tools.
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
---

# Figma page organiser (MoSJE handoff structure)

**The standard is `.claude/rules/figma-handoff-page-structure.md` — read it first; this skill is only the
procedure.** Where this file and the rule disagree, the rule wins and this file is fixed.

Worked example: `docs/design-handoffs/E-Anudaan-Handoff-Page-Plan.md` (target tree, old → new mapping,
call budget). Gate: `npm run check:figma-handoff` (REST, no MCP quota).

**Prerequisites:** load `figma-use` before any `use_figma` call. Batch-load Figma tool schemas in one
`ToolSearch select:` call. Read `.claude/rules/figma-call-budget.md` — the seat stalls after ~20–25 calls.

> **Superseded convention.** Until 17 Sep 2026 this skill numbered top sections by position
> (`NN — PORTAL NAME`) and laid mobile frames inline in the desktop row. E-Utthan and SCW were organised
> that way and are on the migration backlog in `tools/figma-handoff-structure/pages.json`; do not copy
> them as references for the new structure — copy E-Anudaan once its plan is executed.

## Process

### 1. Measure first — free
```bash
npm run check:figma-handoff -- --portal <Portal> --verbose > <scratchpad>/before.txt
node tools/figma-read/read.mjs nodes <pageId> --depth 3 --file <fileKey> --json
```
Not registered? Add the page to `tools/figma-handoff-structure/pages.json` now, conformant or not.
Capture the **before picture** (REST `image` of the largest sections) before any write — the Task Summary
rule needs it and it cannot be reconstructed.

### 2. Gather ground truth for roles and flows (don't guess)
- Route groups and pages: `find apps/hub/src/app/portals/<slug> -name page.tsx` — route groups map to
  frame role prefixes (`(ngo)` ↔ `NGO /`, `(console)` ↔ `Officer /`).
- Roles, sidebars and flow reachability: `docs/research/<host>/INVENTORY.md`, the capture bundle
  (`tools/design-audit/projects/<portal>/out/capture-bundle.json` — `role`, `reachedBy`, `wizard`).
- The case lifecycle (who acts after whom) decides lane order; the sidebar decides flow order where
  flows are independent.

### 3. Write the target tree before touching Figma
In `docs/design-handoffs/<Portal>-Handoff-Page-Plan.md`, copying the E-Anudaan plan's shape:
1. **Lanes** — `B1 · Everyone · Access & Identity`, then user roles in order of first touch. >9 flows → split by phase.
2. **Flows** — tens IDs, dependency order (dashboard → pattern-setting form → derivative forms → uploads → tracking).
3. **Branches** — only where the flow forks (new / instalments; division).
4. **State axis per flow** — pick from rule §3 (wizard, data surface, form, lifecycle, seat, component).
5. **Map every existing section/frame to its new home** with its old number in brackets. Anything with no
   home goes to `C` (no single journey owns it) or `D` (superseded / stray).
6. **Zone A content**, prototype starting points, and the call budget table.

Get the user's sign-off on the tree when it moves a lane boundary they may care about; the rest is mechanical.

### 4. Name frames to `Role / Screen / State[ · Mobile]` — then VERIFY
- Role + screen from the parent section; state from frame content.
- **Cheap + reliable:** bounded top-of-frame DFS (manual stack, `visited < ~500`, only children with
  relative-y `< 460`), TEXT sorted by `fontSize` desc. **Never** `findAllWithCriteria(['TEXT'])` on a
  content-heavy frame — the plugin times out.
- **Wizards:** every step label shows on every frame; find the active step by label fill —
  score `(b − (r+g)/2) + (1 − (r+g+b)/3)`, highest = active.
- **Verify** against the built routes and a screenshot; flag inferred states as inferred in the plan.
  Rename only where the rule's §4 grammar requires — renames break people's bookmarks and searches.

### 5. Restructure in few, atomic writes (see the plan's call table)
1. Create zones + lane sections (empty).
2. Re-parent + rename flows lane by lane (2–3 lanes per call); create branch sections.
3. Create row sections; move `· Mobile` frames into the Mobile row; move dialogs into `Dialogs & Overlays`.
4. Archive: move to `D`, set frame `opacity = 0.4`.
5. Delete an emptied old section **only** after the same script confirms `children.length === 0`.
   Stray nodes in `D2` are never deleted by a script — a human confirms.

### 6. One recursive layout pass = colour + order + position + hug + layer order
```
RAMP = [234,227,220,213,206,199,192]              // #EAEAEA … #C0C0C0, index = depth
PAD_TOP(d) = d<=2 ? 240 : d==3 ? 160 : 120;  PAD(d) = d<=2 ? 160 : 80

layout(node, depth):
  node.fills = [grey(RAMP[min(depth,6)])]
  subs   = sortReading(node.children.filter(SECTION))   // by ID if named with one, else rule §2 row order
  frames = sortState(node.children.filter(!SECTION))    // rule §3 order for this flow's axis
  if node is ZONE B:  place lanes as COLUMNS  x += w + 800, top-aligned
  elif subs:          stack subs DOWN          y += h + (rows ? 120 : 240)
  else (row):         frames in ONE row        x += w + 96
                      Mobile/Tablet rows: x = x of the desktop counterpart (match on name minus " · Mobile")
  recurse into subs first (size before place), then resizeWithoutConstraints to hug
  re-insert children in REVERSE reading order          // Figma lists the last child first
page: A at (0,0); B at (0, A.h+1600); C right of B +1600; D right of C +1600; zones re-inserted D,C,B,A
```
Run it per zone (B per lane if the call is heavy), screenshot between zones.

### 7. Zone A, entry points, handoff marks
- Four `.doc` frames 3840×2160, SAMAVESH text styles, headings ≥96px. Portal Map lanes drawn in the lanes'
  own greys; every flow box a hyperlink to its section node (`setHyperlink({type:'NODE', value:id})` on the
  text range, or a frame reaction).
- Prototype flow starting points, one per happy path, named by flow ID.
- Mark **flow sections only** Ready for dev.

### 8. Verify + document
- `npm run check:figma-handoff -- --portal <Portal> --strict --fresh` must exit 0.
- Screenshot: page overview, the widest lane at 10%, the Portal Map at 25%. Zoom into any section whose
  frames moved rows and confirm phones sit under their desktop counterpart.
- Capture the **after picture** from the same REST renders as the before; compose the pair.
- Update the plan's checklist and any doc citing old section numbers.

## use_figma gotchas that bit us (bake these in)
- **`SECTION` children use coordinates *relative to the section*, not absolute canvas** (verified: a child at `100,100` inside a section at `−11221,12308` resolves to abs `−11121,12408`). So position frames/sub-sections relative to their parent section, and position the top-level sections relative to the page. A recursive layout that sets child `x/y`, recurses, then `resizeWithoutConstraints` the parent works cleanly because of this.
- **Don't read the whole tree with a generic recursive walk** — it descends into component internals (hundreds of vector nodes) and blows the response / drops the MCP connection. Recurse **only into `SECTION` nodes** and treat screen frames as leaves.
- Page context resets every call → `setCurrentPageAsync` at the start of each script that touches a non-default page.
- `node.children` is read-only → clone before sort/iterate-with-mutation.
- Heavy frames time out full text scans → bounded top-band DFS only.
- Always `return` the created/mutated IDs so you can re-verify or roll forward.
- Repositioning is lightweight (just `x`/`y`/`resize`), so the full recursive layout in §5 can move 50+ frames in one call — but it's atomic: if the script errors, nothing changes, so fix and retry. Run it per top section and screenshot between sections to catch mistakes early.
- The MCP connection can drop on very large reads/writes; if so, retry (writes are atomic) and split the work into smaller per-section calls.
- **Layers panel order is reverse child order.** `insertChild(0, n)` puts `n` at the BOTTOM of the panel.
  Re-insert in reverse reading order, or the canvas is tidy and the outline is not — which is exactly how
  E-Anudaan ended up reading `1, 14, 2, 11 …`.
- **Hyperlinks to nodes** only resolve inside the same file; a Portal Map in one file cannot link to another portal's page.
