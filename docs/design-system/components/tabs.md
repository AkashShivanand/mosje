# Tabs — component spec

> **Built and shipped, 2026-08-17.** This file was written as the executable spec for the work
> and is now the record of it: code matches the Figma masters, all three masters are mapped with
> Code Connect, and the tokens exist on both sides. Figma file `3FF5l0SMNIwdpZrKkeyPTm`, page
> **Tabs** (`4645:10196`). Section 3a — long labels — is the part that is easiest to get wrong and
> the part no prop can enforce, so read it before writing any tab copy.

| Master | Node | Key | Variants |
| --- | --- | --- | --- |
| `Tabs` (container) | `55489:870` | `cb696c08…` | 4 — `Orientation` × `Track` |
| `Tabs / Tab` | `2316:353` | `0b1d7214…` | 36 — `Indicator` × `Size` × `State` |
| `Tabs / More` | `55514:848` | `1a32320c…` | 9 — `Size` × `State` |

Deprecated, keys alive: `[Deprecated] Tabs / Tab (Alt)` `2725:1217`,
`[Deprecated] Tabs / Example` `2725:1351`, `[Deprecated] Tabs / Container (legacy)` `2316:389`.

---

## 1. Tokens — done

All four exist on both sides, plus two more the work turned up. **Note where they live:**
`text|icon/brand/primary/bolder` are Tier-2 role tokens and are **generated** by
`build/generate-system-tokens.mjs` into `src/system.generated.json` — authoring them by hand in
`semantic.json` would be overwritten on the next build. Only the `layout/tab/*` pair is authored
in `semantic.json`.

| Token | Alias | Scopes | Why |
| --- | --- | --- | --- |
| `text/brand/primary/bolder` | `color/primaryScale/600` | `TEXT_FILL` | `text/brand/primary/base` (#0373DF) measures **4.07:1** on `bg/neutral/subtler` and **4.19:1** on `bg/brand/primary/base` — both fail WCAG 1.4.3 AA. The bolder rung measures 6.36 / 5.57 / 5.74. |
| `icon/brand/primary/bolder` | `color/primaryScale/600` | `SHAPE_FILL`, `TEXT_FILL` | Pairs with the above for the selected tab's leading icon. |
| `layout/tab/indicator` | `2` | `WIDTH_HEIGHT` | Indicator thickness. Not a border width — does not follow `control/border/width`. |
| `layout/tab/track` | `4` | `WIDTH_HEIGHT`, `GAP` | Inset between the enclosed track and its pills. Matches the shipped `.ds-tabs` padding. |

Two more were added during the work and are **not** Tabs-specific:

| Token | Value | Why |
| --- | --- | --- |
| `cmp/badge/dotSize` · `dotSizeLg` | 6 · 8 | The status dot had **two** hardcoded definitions — `.ds-badge__dot` and the new tab badge. Now one, shared. 6 and not the on-grid 8 because beside 14px label text an 8px dot reads as a bullet, not a signal. Created in the Figma library too. |
| `inline/xl` | 24 | `inline` was the only spacing family without a 24 step (`stack/l` and `padding/xl` both have one), so every 24px horizontal gap reached past the semantic layer. Inserting it pushed the old `inline/xl` (32) to `inline/2xl` — renamed in place in Figma, 2 code call sites migrated, proven value-preserving by the contract fixture before rebaselining. |

**`focus/ring` is now opaque** in Blue (`#0373DF`) and Navy (`#003366`). At 48% alpha it
composited to **2.01:1** on white, **1.92:1** on the track and **1.16:1** on a selected pill —
all below the 3:1 floor of WCAG 1.4.11 / 2.4.11. Opaque it is 4.64:1 on `bg/neutral/base` and
4.07:1 on `bg/neutral/subtler`.

**A 28 step for `padding` was attempted and abandoned** — the documentation house style's panel
padding is 28 and had no semantic name. Three independent constraints refuse it, and all three
are right: `padding` already uses **all eleven** canonical rung names (`none`…`4xl`) in
`space-linkage.test.mjs`, so there is no slot; `space` has no 28 primitive because its ramp runs
in 4s to 24 and in 8s from 32; and that gate requires every semantic space token to alias a
primitive, so a literal is refused too. Aliasing `{size.28}` was tried and reverted — `size/*`
is a rem scale, and 1.75rem in a px ramp **inverts** the ramp below a 16px root. The
documentation moved onto 32 instead.

Both contract fixtures were regenerated and the diffs audited key-by-key rather than trusted.

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
  badge?: boolean;      // the shared status dot — cmp/badge/dotSize (6), 8 at size="l"
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
| `Show overflow` (boolean) | — | Reveals the More trigger. Horizontal only. NO code prop: there is no React counterpart, so a horizontal list simply scrolls. See §4. |
| Slot | `children` / `tabs` | Any number of tabs. |

**Pairing rule:** `track="none"` takes Underline (horizontal) or Rail (vertical);
`track="enclosed"` takes Pill. A Pill on an open track and an Underline in a filled track both
read as broken.

**Equal width:** in `track="enclosed"` the tabs are `flex: 1 1 0` — already true in
`tabs.css`. In `track="none"` they are content-width (`flex-shrink: 0`), matching UX4G.

**Divider:** must be coplanar with the indicator — the selected tab replaces that segment of the
rule rather than stacking a second line above it.

---

## 3a. Long labels — the rules, the escalation, and what the component actually does

This is the one part of Tabs that no prop can enforce, and the one that breaks most often. A
label is **content**. No setting fixes a badly written one.

### The rules

1. **A tab label names a destination.** It is not a sentence. One or two words; aim for 20
   characters or fewer in English.
2. **Budget for the longest translation, not the English.** Devanagari renders the same phrase
   10–30 % longer. A label that fits in English and truncates in Hindi is a defect found in
   production, not in review.
3. **In `track="enclosed"` every tab is the same width**, so the *longest* label sets what all
   of them can show. One long label degrades the whole set, not just its own tab. (Measured off
   the master: three tabs at 102.67px each in a 312px slot — equal width is the design, not an
   accident.)
4. **Two labels must never truncate to the same visible string.** "Application details" and
   "Application status" both become "Application…", and the row stops being navigation.
   Front-load the word that distinguishes them — "Details" / "Status".
5. **Never wrap to two lines.** It breaks the height hug and the indicator alignment, and makes
   the row's height depend on the longest label.
6. **Icons and the badge dot do not buy space, they spend it.** Both narrow the room the label
   has, and neither is free.

### The escalation, when a label does not fit

In this order. Truncation is **last**, and reaching for it first is the actual mistake:

| # | Do this | Why it comes first |
| --- | --- | --- |
| 1 | **Shorten the label.** | Costs nothing, fixes every viewport, and is almost always available. |
| 2 | **Move to `track="none"`.** | Tabs become content-width and the row scrolls, so every label keeps its full width. |
| 3 | **Reveal the overflow menu.** | Preserves both the labels *and* their discoverability. No React counterpart yet — see §4. |
| 4 | **Accept the ellipsis.** | The fallback the component provides so a squeeze degrades instead of breaking. |

### What the component does, mechanically — one problem, four answers

No single affordance reaches every user, so the component does not try to find one.

| Input | What happens | Why not the others |
| --- | --- | --- |
| **Mouse / pen** | The label clips with an ellipsis and a `Tooltip` shows the full text on hover. | — |
| **Keyboard** | The same tooltip opens **instantly on focus**, pointer nowhere near. Escape dismisses it without moving focus (WCAG 1.4.13). | `title` never opened on focus at all. That was the biggest hole in the old behaviour, and it is why `title` is gone. |
| **Screen reader** | Nothing to rescue. The clipping is CSS, so the full string is already the button's accessible name. The bubble is `aria-hidden` and carries **no** `aria-describedby`. | Without that suppression the name is announced **twice** — "Application details, tab, Application details" — a regression, not a rescue. |
| **Touch** | The label is **not clipped at all**. Under `@media (hover: none)` enclosed tabs stop sharing the width equally, size to their content, and the row scrolls. | A tooltip is unreachable without hover. The only honest fix is to remove the truncation, not to annotate it. |

The predicate is `hover: none`, **not** `pointer: coarse`, and deliberately so: what decides
this is whether the *rescue* works, not how precise the finger is. A stylus reports
`hover: none, pointer: fine` and needs identical treatment.

**Vertical lists never truncate — they wrap.** A column's items size independently and the
rail is measured from the button at runtime, so a wrapped label costs nothing structurally:
no row baseline to break, no sibling height to drag along. Wrapping hides nothing and needs
no affordance on any input. This is why "never wrap" is a rule about **rows**. The documented
heights (36 / 44 / 48) describe a single-line tab; a wrapped one is taller and still a hug.

**Measurement is driven by a `ResizeObserver`, not a `resize` listener.** Whether a label is
clipped is a function of the width its container gave it, and a container can change without
the window moving — a collapsing sidebar, a sibling growing, a panel opening, a webfont
swapping in. Observed live before this was fixed: narrowing the container left the rail at
44px against a tab that had wrapped to 64px, and only a window resize corrected it. Every tab
is observed as well as the list, because a font swap resizes the labels without changing the
list's own box.

**Never shorten the string in JavaScript.** That rewrites the accessible name too, and turns
a visual compromise into a real loss.

### Why this behaviour exists at all

`flex: 1 1 0` hands every enclosed tab the same slot and `white-space: nowrap` does not care
whether the label fits — so before this, a long label **painted over its neighbour**:
"Application details" ran through "Documents" in a 720px track. The ellipsis is the fix for that
specific failure. The Figma masters define **no truncation treatment**, so the visual is a
code-side decision and remains an open design question.

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

## 7. Definition of done — met

- [x] Tokens added; `focus/ring` opaque; `npm test -w @mosje/tokens` green (**130** tests — the
      count moved from 119 because the space-linkage gate landed from another branch mid-work)
- [x] `tabs.tsx` / `tabs.css` carry indicator, size, track, orientation, disabled, icon, badge
- [x] Disabled tabs skipped by arrow keys, retained with `aria-disabled` — verified in-browser:
      ArrowRight from index 2 wraps past disabled index 3 to index 0
- [x] `npm run check:ds-linkage` green — no raw values in the new CSS
- [x] Storybook covers every axis; `check:storybook`, `:parity`, `:types`, `:smoke` green (342 stories)
- [x] `design.md` updated and `Last reviewed` bumped; changelog entry added
- [x] `tabs.figma.ts`, `tab.figma.ts` and `tabs-more.figma.ts` written, excluded from tsconfig,
      and **all three pushed** — the library is published, so Code Connect is live, not anticipated
- [x] Branch + PR

**Two defects were found by measuring rather than looking**, both pre-existing: the sliding
indicator sat 1px off on any bordered track (`getBoundingClientRect` reports the border box, but
the indicator is positioned against the padding box), and the enclosed track's gap was 4 against
the master's 2.

## 8. Known gaps carried forward

Recorded in full in the Figma **`Tabs — Component record`** frame (section `3 · Record —
maintainers`). Still open:

- The container's key was forked when the master was rebuilt, which breaches
  `component-authoring.md` §11.
- The Density collection is bypassed.
- Alignment is a container override rather than a property.
- The focus-ring offset is unbindable in Figma.
- The library `Badge` inherits a raw `#FFFFFF`.
- **No truncation treatment is designed.** The ellipsis and `title` in §3a are a code-side
  fallback, not a design decision — and `title` does not work on touch.
- `Tabs / More` has no React counterpart, so there is no `overflow` prop. Its Code Connect
  template deliberately emits **no JSX**: an unmapped master hands an agent nothing in Dev Mode,
  and nothing is indistinguishable from *not looked into*, so the agent invents a component.

Closed by this work: label truncation (§3a), and the estate's duplicate status-dot definitions.
