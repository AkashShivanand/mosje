# Tabs — component spec

> Figma masters are built and published-ready; **code is not yet updated**. This file is the
> executable spec for that work. Figma file `3FF5l0SMNIwdpZrKkeyPTm`, page **Tabs** (`4645:10196`).

| Master | Node | Key | Variants |
| --- | --- | --- | --- |
| `Tabs` (container) | `55489:870` | `cb696c08…` | 4 — `Orientation` × `Track` |
| `Tabs / Tab` | `2316:353` | `0b1d7214…` | 36 — `Indicator` × `Size` × `State` |
| `Tabs / More` | `55514:848` | `1a32320c…` | 9 — `Size` × `State` |

Deprecated, keys alive: `[Deprecated] Tabs / Tab (Alt)` `2725:1217`,
`[Deprecated] Tabs / Example` `2725:1351`, `[Deprecated] Tabs / Container (legacy)` `2316:389`.

---

## 1. Tokens to add — do this first

Everything else depends on these. Add to `packages/tokens/src/semantic.json`, then
`npm run build -w @mosje/tokens && npm test -w @mosje/tokens`.

| Token | Alias | Scopes | Why |
| --- | --- | --- | --- |
| `text/brand/primary/bolder` | `color/primaryScale/600` | `TEXT_FILL` | `text/brand/primary/base` (#0373DF) measures **4.07:1** on `bg/neutral/subtler` and **4.19:1** on `bg/brand/primary/base` — both fail WCAG 1.4.3 AA. The bolder rung measures 6.36 / 5.57 / 5.74. |
| `icon/brand/primary/bolder` | `color/primaryScale/600` | `SHAPE_FILL`, `TEXT_FILL` | Pairs with the above for the selected tab's leading icon. |
| `layout/tab/indicator` | `2` | `WIDTH_HEIGHT` | Indicator thickness. Not a border width — does not follow `control/border/width`. |
| `layout/tab/track` | `4` | `WIDTH_HEIGHT`, `GAP` | Inset between the enclosed track and its pills. Matches the shipped `.ds-tabs` padding. |

**Also change:** `focus/ring` currently carries **48% alpha**. Composited it measures
**2.01:1** on white, **1.92:1** on the track and **1.16:1** on a selected pill — all below the
3:1 floor of WCAG 1.4.11 / 2.4.11. Make it opaque in **both** Blue and Navy modes. Already done
in Figma (`Palette::focus/ring`); the code side must follow or Figma-parity tests will diverge.

Expect `figma-value-parity.test.mjs` and the visual-contract fixture to need regenerating —
audit the diff against both parents rather than trusting the auto-merge.

---

## 2. `Tabs / Tab` — the item

### API

```ts
export type TabIndicator = "underline" | "rail" | "pill";
export type TabSize = "s" | "m" | "l";

export interface TabDef {
  id: string;
  label: string;
  icon?: string;        // Material Symbols Rounded glyph name
  badge?: boolean;      // 8px dot
  disabled?: boolean;
}
```

### Figma → code mapping

| Figma property | Code | Notes |
| --- | --- | --- |
| `Indicator` = Underline · Rail · Pill | `indicator` on `<Tabs>` | Ordered by chrome. Rail is vertical-only. |
| `Size` = S · M · L | `size` on `<Tabs>` | Applies to the whole list, never per tab. |
| `State` = Default · Hover · Selected · Disabled | derived — `active` index, `:hover`, `TabDef.disabled` | Not a prop. |
| `Focused` (boolean) | `:focus-visible` | **Composes with every state.** Not a state value — activation is automatic, so a keyboard user's tab is Selected *and* Focused. |
| `Label` (text) | `TabDef.label` | |
| `Show icon` (boolean) + exposed icon instance | `TabDef.icon` | Absent ⇒ no icon. |
| `Show badge` (boolean) | `TabDef.badge` | |

### Geometry — every height is hug-derived, never hardcoded

| Size | padY | padX | Type | Height | Icon |
| --- | --- | --- | --- | --- | --- |
| S | `padding/xs` 8 | `padding/s` 12 | `Label/label-1` 14/20 | **36** | `icon/size/16` |
| M | `padding/s` 12 | `padding/m` 16 | `Label/label-1` 14/20 | **44** = `target/comfortable` | `icon/size/20` |
| L | `padding/s` 12 | `padding/l` 20 | `Body/body-1` 16/24 | **48** = `target/spacious` | `icon/size/24` |

All clear WCAG 2.2 §2.5.8 (24×24). 44×44 is §2.5.5 **AAA** and UX4G's mobile recommendation —
only M and L meet it; that is not an AA failure.

### Colour per state

| State | Label | Icon | Indicator | Pill fill |
| --- | --- | --- | --- | --- |
| Default | `text/neutral/subtle` | `icon/neutral/subtle` | hidden | none |
| Hover | `text/neutral/base` | `icon/neutral/base` | `border/neutral/bolder/default` | `bg/neutral/subtle` |
| Selected | `text/brand/primary/bolder` | `icon/brand/primary/bolder` | `border/brand/primary/base` | `bg/brand/primary/bolder` + `on/bg/brand/primary/bolder` |
| Disabled | `text/neutral/disabled` | `icon/neutral/disabled` | hidden | none |

Radius: Pill `shape/md` (8); Underline and Rail `shape/none`.

### Focus ring

`focus/offset` (2) + `focus/width` (2) = **4px inset**, 2px ring, leaving a **2px transparent gap**.
Ring radius: Pill `shape/lg` (12, concentric with 8 + 4); Underline and Rail `shape/md` (8).

In CSS this is the existing two-layer `box-shadow` — keep it:
```css
box-shadow: 0 0 0 2px var(--sa-bg-neutral-subtler), 0 0 0 4px var(--sa-focus-ring);
```
**Do not** try to reproduce the Figma construction with a single shadow — and note the reverse
was evaluated in Figma and rejected, because Figma renders drop shadows from the fill silhouette,
so a shadow ring is invisible on Underline and Rail, which have no root fill.

---

## 3. `Tabs` — the container

| Figma property | Code | Notes |
| --- | --- | --- |
| `Orientation` = Horizontal · Vertical | `orientation` | Vertical ⇒ Up/Down arrows + `aria-orientation="vertical"`. |
| `Track` = None · Enclosed | `track` | Enclosed is today's `.ds-tabs`: `bg/neutral/subtler`, 1px `border/neutral/subtle`, `shape/lg`, `layout/tab/track` inset. |
| `Show divider` (boolean) | `divider` | Meaningless when `track="enclosed"`. |
| `Show overflow` (boolean) | `overflow` | Reveals the More trigger. Horizontal only. |
| Slot | `children` / `tabs` | Any number of tabs. |

**Pairing rule:** `track="none"` takes Underline (horizontal) or Rail (vertical);
`track="enclosed"` takes Pill. A Pill on an open track and an Underline in a filled track both
read as broken.

**Equal width:** in `track="enclosed"` the tabs are `flex: 1 1 0` — already true in
`tabs.css`. In `track="none"` they are content-width (`flex-shrink: 0`), matching UX4G.

**Divider:** must be coplanar with the indicator — the selected tab replaces that segment of the
rule rather than stacking a second line above it.

---

## 4. `Tabs / More` — the overflow trigger

Heights match the tabs exactly (36 / 44 / 48). **It is a menu button, not a tab:**
`role="button"`, `aria-haspopup="menu"`, `aria-expanded` — never `role="tab"`, which would
promise a panel that does not exist. It is never the selected item. `State=Open` means the menu
is open. No coded counterpart exists yet; today the component degrades to `overflow-x: auto`.

---

## 5. Keyboard and ARIA — already correct, do not regress

`tabs.tsx` today is ahead of UX4G and must stay that way:

- Arrow Left/Right **and** Up/Down, wrapping; Home/End
- roving `tabindex`, `aria-selected`, `aria-controls`, `aria-labelledby`, `aria-orientation`
- a polite live region announcing the section change (WCAG 4.1.3)
- `prefers-reduced-motion` honoured

Additions required: **skip disabled tabs** during arrow navigation, and keep them in the
tablist with `aria-disabled="true"` rather than removing them.

---

## 6. Code Connect — `components/navigation/tabs.figma.ts`

Write only **after** the props above exist. `.figma.ts` (parserless template), never `.figma.tsx`.
Must be excluded from the package tsconfig or `npm run typecheck` fails on the virtual `figma`
import. Account for **every** Figma property — map it, or comment why it is omitted. Map every
variant value exhaustively. Push with `add_code_connect_map`; an existing mapping cannot be
overwritten via the API, so get it right first.

**Note:** Code Connect cannot currently be published — it needs a Developer seat on an
Organization plan. Treat the template as authored-in-anticipation, consistent with
`button.figma.ts` and `accessibility-bar.figma.ts`.

---

## 7. Definition of done

- [ ] Four tokens added; `focus/ring` opaque; `npm test -w @mosje/tokens` green (119 tests)
- [ ] `tabs.tsx` / `tabs.css` carry indicator, size, track, orientation, disabled, icon, badge
- [ ] Disabled tabs skipped by arrow keys, retained with `aria-disabled`
- [ ] `npm run check:ds-linkage` green — no raw values in the new CSS
- [ ] Storybook story covers the axes; `check:storybook`, `:parity`, `:types`, `:smoke` green
- [ ] `design.md` updated and `Last reviewed` bumped; changelog entry added
- [ ] `tabs.figma.ts` written and excluded from tsconfig
- [ ] Branch + PR — never commit to `main`

## 8. Known gaps carried forward

Recorded in full in the Figma **`Tabs — Component record`** frame (section `3 · Record —
maintainers`): the container's new key (breaches §11), the bypassed Density collection, no label
truncation, alignment by container override rather than a property, the unbindable focus-ring
offset, and the inherited raw `#FFFFFF` in the library `Badge`.
