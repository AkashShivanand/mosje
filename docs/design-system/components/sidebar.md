# Sidebar — component spec

> Figma: SAMAVESH DS › Sidebar page, section `1 · Sidebar`. Masters: `Sidebar` (4286:428),
> `Sidebar/Item · Level 1` (4286:285), `Sidebar/Item · Level 2` (4286:361),
> `Sidebar/Item · Level 3` (57129:1097), `Sidebar/GroupLabel` (57137:1189),
> `Sidebar/CollapseControl` (57137:1199), `Sidebar/Flyout` (57137:1200).
> Code: `packages/design-system/components/navigation/sidebar/`. Rebuilt 2026-09-05 from the
> audit in the Portal Sidebar Audit; the three pre-existing sets were mutated in place so their
> keys and every existing instance link survive.

## What it is

The portal app-shell left rail. Three levels: a level-1 item with an icon; level-2 entries under
a group; level-3 leaves under a level-2 group. Two modes: expanded (`layout/sidebar/width`, 300)
and collapsed (`layout/sidebar/collapsedWidth`, 88). Below the tablet breakpoint it is a drawer
(`AppShell` renders the same `SidebarNav` in `SideSheet side="left"`), never a narrower column.

## Anatomy

| Part | Figma | Code |
|---|---|---|
| Rail | `Sidebar` — Mode, Menu slot, Footer slot, Show Control, Show Footer | `SidebarNav` root `<aside>` with one `<nav aria-label>` |
| Level-1 item | `Sidebar/Item · Level 1` — Mode × Type (Leaf/Group) × Open × State, Focused, Show Badge, Icon swap, Label, Show Child 2–5 | `groups[].items[]` — `<a>` for a page, `<button aria-expanded>` for a group |
| Level-2 entry | `Sidebar/Item · Level 2` — Placement (Inline/Flyout) × Type × Open × State, Focused, Label, Show Child 2–4 | `items[].children[]` |
| Level-3 leaf | `Sidebar/Item · Level 3` — State, Focused, Label | `children[].children[]` |
| Group label | `Sidebar/GroupLabel` — Mode × Show Divider, Label | `groups[].label` → `role="group" aria-labelledby` |
| Collapse control | `Sidebar/CollapseControl` — Mode, nested IconButton exposed | rendered when `showCollapseControl && onCollapsedChange` |
| Flyout | `Sidebar/Flyout` — Title, Item 1–5 (Level 2, Placement=Flyout) | rendered for a collapsed group on click |

## Token map

| Property | Token |
|---|---|
| Rail width | `layout/sidebar/width` 300 · `layout/sidebar/collapsedWidth` 88 (added 2026-09-05) |
| Flyout width | `layout/sidebar/flyoutWidth` 240 (added 2026-09-05) |
| Rail padding · region gap · item gap | `padding/16` · `stack/12` · `stack/4` |
| Level-1 row | `padding/12` × `padding/16`, gap `inline/8`, radius `shape/16`, min-height `target/spacious` (48) |
| Level-2 / 3 row | `padding/12` × `padding/8`, radius `shape/8`, min-height `target/comfortable` (44) |
| Indent | level 2 `inline/40` · level 3 `inline/56` · flyout `inline/0` |
| Guide line | `cmp/divider/width` in `border/neutral/subtle`, at 27px (icon centre) and 47px (level-2 label) |
| Type | level 1 `Label/label-1` · levels 2–3 `Body/body-2` · group label `Label/label-3` · flyout title `Title/title-3` |
| Rest | `text/neutral/base`, `icon/neutral/base`, chevron `icon/neutral/subtle` |
| Hover | `bg/neutral/subtler` |
| Current | `bg/brand/primary/base` with `text/brand/primary/bolder`, `icon/brand/primary/bolder` |
| Disabled | `text/neutral/disabled`, `icon/neutral/disabled` |
| Focus | `focus/ring` at `focus/width`, offset `focus/offset`; ring radius `shape/20` (L1) / `shape/12` (L2, L3) |
| Badge | count: `bg/status/info/bolder` on `on/bg/brand/primary/bolder` · dot: `cmp/badge/dotSizeLg` |
| Flyout | `shape/12`, `stroke/1` `border/neutral/subtle`, `elevation/dropdown`, `z/popover` |
| Motion | hover `motion/hover/*` · rail width `motion/collapse/*` |

## Decisions recorded (with the reason)

1. **Active ink is `bolder`, not `base`.** `text/brand/primary/base` on `bg/brand/primary/base`
   measures 4.19:1 in Blue mode and fails WCAG 1.4.3 at 14px; `bolder` is 5.74:1. Both Figma
   libraries still bound `base`; the code had already moved. Now the master agrees.
2. **Hover is neutral.** The previous master painted hover in the same brand tint as Active, so
   moving the mouse over the rail made every row look like the current page.
3. **Item gap is `stack/4`, down from `stack/12`.** Material 3, Carbon and USWDS all list
   navigation items with 0–4px between rows; 12px on a ten-item rail cost 108px and read as
   a list of cards rather than one navigation.
4. **Levels 2 and 3 indent under the parent's text and carry a single guide line per level,
   not elbows.** Elbows need first/middle/last variants (nine of the old set's variants were
   exactly that) and get busy at three levels. USWDS and GitHub's tree views use indentation
   plus a guide; that pattern needs no position variants.
5. **Focused is a boolean, not a State value.** It composes with every state (a keyboard user's
   current item is Active and Focused), the same decision `Tabs / Tab` made.
6. **Group children are exposed nested instances, not a slot.** The Plugin API in this runtime
   has no `createSlot`, and a cloned slot becomes a plain frame inside a variant set. Five
   exposed children (four at level 2) with `Show Child N` booleans cover every handoff group
   counted (max five), and further Level 2 instances can be placed after the group in the Menu
   slot when a role needs more.
7. **Collapsed groups open a flyout that lists one level.** Atlassian and Material's expanded
   rail both stop at one level in a flyout; a second flyout beside a 88px rail is unreachable
   on touch.
8. **The collapse control is a visible 40px IconButton at the foot**, replacing a hover-only
   16px strip with a `col-resize` cursor that toggled instead of resizing. Glyphs match
   `Navbar/MenuToggle` (`left_panel_close` / `left_panel_open`).
9. **A badge count becomes a dot when collapsed** rather than disappearing.
10. **Level-2 and level-3 rows are 44px** (`target/comfortable`), matching Figma; code had
    drifted to 40.

## Benchmark

| System | Levels | Current indicator | Collapsed form | What we took |
|---|---|---|---|---|
| USWDS side navigation | 1–3 | left border bar + bold | none (in-page nav) | three levels, indentation, "show the current page, keep labels short" |
| Material 3 navigation rail (expressive) | 1 + sections | tinted pill (secondary container) | 96dp rail, 3–7 destinations, expands to drawer | tinted pill, collapsed ↔ expanded as one component, badge on icon |
| IBM Carbon UI shell left panel | 2 (one nested) | 4px interactive bar | 48px rail with flyout on hover | flyout for a collapsed group, `aria-expanded` on a submenu header |
| Shopify Polaris navigation | 2 | tinted row | none | icon on level 1 only, quieter type on children |
| Atlassian side navigation | 3 via nested flyouts | tinted row | collapsed with flyouts | one flyout level only; nested flyouts rejected for touch |
| UX4G 3.0 | 1 | tinted row | none | 300 rail width, 48 item height, 24 icon |

## Handoff migration (deferred, per instruction)

The `MoSJE Portal — Handoff` file still instances the deprecated Portal DS sets (24 rails, 260
items, 20 child items). They are to be migrated screen by screen, one at a time, to the SAMAVESH
`Sidebar`, resetting the four hand-resized rails (260/268/280 → bound 300), naming the twenty
"Label" children, and leaving one current item per rail.

## Open items

- Publish the SAMAVESH library after this pass (a script cannot publish).
- `AppShell` adoption by the eight portal shells, one per PR, so the drawer below tablet is real.
- Storybook and Playwright coverage of the flyout and the three-level tree.
