---
name: figma-page-organiser
description: Organise a messy Figma handoff page of portal screens into the MoSJE house convention — numbered SECTIONs on the canonical SAMAVESH depth-graded greyscale, sub-sections by feature, frames named "Role / Screen / State", flows laid out as single left-to-right rows on an 8px grid, and every section hugged to content. Use when a Figma page (e.g. in the "MoSJE Portal — Handoff" file) has scattered, duplicate-named, or ungrouped screen frames that need to be tidied the way the E-Utthan and SCW pages were. Requires the figma-use skill and Figma MCP tools.
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
---

# Figma page organiser (MoSJE handoff convention)

Turns a raw Figma page of screen frames into a tidy, navigable handoff page that matches the **E-Utthan** and **SCW** reference pages in the `MoSJE Portal — Handoff` file (`gH2vQ62cfg4677YKWuOpLc`).

**Prerequisite:** load the `figma-use` skill before any `use_figma` call (mandatory). Batch-load the Figma tool schemas with one `ToolSearch select:` call. Reference pages to copy: E-Utthan (`node-id=4226-36929`) and SCW (`node-id=4619-49381`). The full E-Utthan taxonomy is documented in `docs/design-handoffs/EUtthan-Admin-Portal-Handoff.md` §2.

## The house convention (what "organised" means)

1. **Depth-graded grey hierarchy** (Figma `SECTION` nodes, not rectangles). Use the **canonical SAMAVESH greyscale** (established on E-Utthan) — a 7-step scale, `7/255` (~2.7%) darker per nesting level. Adjacent steps are intentionally gentle; it's the *containment* plus the cumulative depth that makes the hierarchy read, so always nest real sections (don't rely on one big step):

   | Depth | Hex | 0–1 (r=g=b) | Used for |
   |---|---|---|---|
   | 0 | `#EAEAEA` | `234/255` | **Superset container** — one master section wrapping the whole product (all portals) |
   | 1 | `#E3E3E3` | `227/255` | Main / portal section (`01 — CITIZEN PORTAL`, …) |
   | 2 | `#DCDCDC` | `220/255` | Sub-section (feature) |
   | 3 | `#D5D5D5` | `213/255` | Flow group (e.g. Pledge, Login) |
   | 4 | `#CECECE` | `206/255` | Step / variant group |
   | 5 | `#C7C7C7` | `199/255` | deeper |
   | 6 | `#C0C0C0` | `192/255` | deepest (clamp here) |

   Deeper = darker, so the eye reads containment. Apply the fill **by computed depth** during the layout traversal: `node.fills = [greyFill(depth)]` where `greyFill` reads `[234,227,220,213,206,199,192][min(depth,6)]/255`.

   **The `#EAEAEA` superset container (depth 0) is for MULTI-portal pages only.** It's a master section wrapping one whole product, created **once per portal** when several portals share a page (e.g. E-Utthan + SCW + NOS + NMBA on one canvas). **On a single-portal page (just SCW), do NOT create it** — the page itself is the container, so start the palette at depth 1 (`#E3E3E3`) for the top sections. Concretely: lay out single-portal top sections with `layout(section, 1)`; in the multi-portal case wrap each product in a depth-0 `#EAEAEA` section and lay out from there.
   - **Top sections** named `NN — PORTAL NAME` (uppercase, em-dash `—`, zero-padded). **Number == top-to-bottom position** (renumber if you reorder — don't leave E-Utthan's number/position mismatch where auth sat on top but was numbered last).
   - **Sub-sections** named by feature in Title Case (`SAGE Applications`, `Events`, `Service Directory`, `Desktop`, `Mobile`).
2. **Frame naming:** `Role / Screen Name / State` with spaces around slashes.
   - Role = `Admin` / `Citizen` / `SAGE` / `Volunteer` / `Login` / `Ministry` …
   - State = `List`, `Add`, `Edit`, `Detail`, `Scrolled`, `Step N — <Name>`, `(Modal)`, `Success`, etc. Omit when there's only one state.
   - **Every screen lives inside a section — even a single-screen feature gets its own one-frame sub-section** (consistency beats saving a box). Don't leave loose frames directly under a portal section.
   - Mark stray helper/annotation artifacts (loose instances, lone cells) with a `.` prefix: `.helper / Dropdown Menu`.
3. **Layout — single-row flows, vertical stack.** Inside each sub-section, lay the screens out in a **single horizontal row** in flow order (step 1 → N, left to right) so a reviewer scans the flow at a glance. Stack sub-sections vertically within their section; stack the top-level sections vertically down the page. (Side-by-side top sections only work when flows are short; with single-row flows the page is naturally tall-and-narrow per section, so vertical stacking is correct.) Long flows (e.g. a 20+ screen wizard) will run wide — that's an accepted trade for scannability; sub-group only if a row becomes unwieldy.

   **Spacing — all on an 8px grid:** frame gutter `96`, helper gap `48`, sub-section gap `160`, top-section gap `400`, padding `80` (sub-section) / `120` (top section). Hug every section to its content (deepest-first) after positioning.

## Process

### 1. Gather ground truth (don't guess screen names)
- Read the recon/inventory for the portal if it exists (`docs/research/<host>/INVENTORY.md`) — it gives the real screen list, roles, flows, and states.
- Open the reference page screenshot (E-Utthan `4226-36929`) so you copy the exact look.

### 2. Map the current page (read-only)
- The target `node-id` is usually a **PAGE**, not a frame. `getNodeByIdAsync` it; if `type === 'PAGE'`, `await figma.setCurrentPageAsync(page)` then read `page.children`.
- Enumerate top-level children, then drill in. **Clone child arrays before `.sort()`** — `node.children` is read-only and `.sort()` mutates in place (`TypeError: '0' is read-only`). Use `[...sec.children].sort(...)`.
- List every `SECTION` (with depth + current fill) in one recursive read so you know what to recolour and what's missing.

### 3. Name the frames to `Role / Screen / State`, then VERIFY
Derive **Role** + **Feature** from the parent sub-section (reliable). Derive **State** from frame content:
- **Cheap + reliable:** extract each frame's top headings/CTAs and infer the screen + state. Build the rename map in code, then apply with one script that just sets `.name` (lightweight — 50 renames in one call is fine).
- **AVOID full-subtree text scans on content-heavy frames** (`findAllWithCriteria(['TEXT'])` over a 3000px form/map frame) — the plugin **times out**. Instead use a **bounded top-of-frame DFS**: a manual stack, cap `visited < ~500`, and only descend where the child's relative-y is in the top band (e.g. `< 460`). Collect TEXT, sort by `fontSize` desc.
- **Wizards / steppers** (all steps' labels show on every frame, so headings don't disambiguate the active step): detect the **active step by label fill colour**. Scan the stepper band, match the known step-label strings, read each label's `fills[0].color`; the active one scores highest on "navy + darkness" (`(b − (r+g)/2) + (1 − (r+g+b)/3)`). This reliably recovers Step 1…N.
- **VERIFY inferred labels — never ship confident guesses.** Roles/screens and wizard step numbers are reliable; fine sub-states (List/Add/Empty, map variants) are often guessed from canvas order. Cross-check them against (a) the built app if it exists (`apps/portals/<portal>` routes/components — grounds screen identity + step count) and (b) the frames themselves (screenshot or bounded heading scan). This catches **category errors** — e.g. a row named `Service Directory / *` that is actually the *Assisted Living Devices* application flow. Also flag screens that exist in code but are **missing** from Figma — Figma holds key screens only, so exact 1:1 isn't expected; only call out genuinely crucial gaps.

### 4. Decide ordering
Order by product logic, not current canvas position: top sections by primacy (**number == position**), sub-sections by the live **sidebar/nav order**, frames within a flow by **flow order** (list → detail → modals → success → add; wizard step 1→N). Encode as an `ORDER` map `{parentId: [childId, …]}`; fall back to current `(y,x)` order for anything unlisted.

### 5. Run the recursive layout (one pass = colour + order + position + hug)
A single recursive `layout(node, depth)` realises the whole convention. Because it sizes children *before* placing them, the bottom-up pass hugs every section correctly — no separate hug step:
```
layout(node, depth):
  node.fills = [greyFill(depth)]                         // depth-graded grey
  kids   = ordered(node)                                 // ORDER map, else (y,x)
  screens= non-SECTION kids with w ≥ 0.4·maxW            // helpers = the small rest
  subs   = SECTION kids
  cy = pad(depth)                                        // 120 top, 80 deeper
  rowPlace(screens) at (pad, cy) → ONE horizontal row, gutter 96   // flow scanning
  rowPlace(helpers) below, gap 48
  for sub of subs: layout(sub, depth+1); sub.{x,y}=(pad, cy); cy += sub.h + 160
  node.resizeWithoutConstraints(contentRight + pad, cy + pad)      // hug
```
Run it per top section (`layout(section, 1)` for single-portal; `layout(wrapper, 0)` for multi-portal), then stack the top sections down the page with a **400px** gap. Verify each section with a screenshot before doing the next.

### 6. Verify + document
- `get_screenshot` the whole page node and eyeball it against the E-Utthan reference.
- Write/refresh a `docs/design-handoffs/<Portal>-Handoff.md` §2 "Page Organisation" tree mirroring the E-Utthan doc, so the taxonomy is captured outside Figma too. Flag any **inferred** states (e.g. map sub-states) as inferred.

## use_figma gotchas that bit us (bake these in)
- **`SECTION` children use coordinates *relative to the section*, not absolute canvas** (verified: a child at `100,100` inside a section at `−11221,12308` resolves to abs `−11121,12408`). So position frames/sub-sections relative to their parent section, and position the top-level sections relative to the page. A recursive layout that sets child `x/y`, recurses, then `resizeWithoutConstraints` the parent works cleanly because of this.
- **Don't read the whole tree with a generic recursive walk** — it descends into component internals (hundreds of vector nodes) and blows the response / drops the MCP connection. Recurse **only into `SECTION` nodes** and treat screen frames as leaves.
- Page context resets every call → `setCurrentPageAsync` at the start of each script that touches a non-default page.
- `node.children` is read-only → clone before sort/iterate-with-mutation.
- Heavy frames time out full text scans → bounded top-band DFS only.
- Always `return` the created/mutated IDs so you can re-verify or roll forward.
- Repositioning is lightweight (just `x`/`y`/`resize`), so the full recursive layout in §5 can move 50+ frames in one call — but it's atomic: if the script errors, nothing changes, so fix and retry. Run it per top section and screenshot between sections to catch mistakes early.
- The MCP connection can drop on very large reads/writes; if so, retry (writes are atomic) and split the work into smaller per-section calls.
