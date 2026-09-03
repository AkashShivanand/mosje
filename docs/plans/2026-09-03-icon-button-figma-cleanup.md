# IconButton — the Figma cleanup, and the two things I got wrong first

**Branch** `ds/icon-button-cleanup` · **2026-09-03** · **Status** UI defects fixed; one
item open, one decision for a human.

Reported in review with a screenshot: an icon button drawn as a **white box with a heavy
drop shadow**, beside bare glyphs with no container.

---

## 1. The app was never broken

`/design-system/components/actions/icon-button`, computed styles from Chromium:

| | background | border | box-shadow | radius | box |
|---|---|---|---|---|---|
| Filled, rest | `rgb(0,94,185)` | same | **none** | 8px | 40×40 |
| Filled, hover | `rgb(0,94,185)` | same | **none** | 8px | 40×40 |
| Filled, focus | `rgb(0,94,185)` | same | **none** | 8px | 40×40 |
| Outlined, rest | transparent | `rgb(0,94,185)` | **none** | 8px | 40×40 |

The screenshot was of the **Figma set**.

---

## 2. What it actually was: a white button on a white page

`Tone=Inverse` paints `cmp/action/brand/primary/inverse/default/bg`, which resolves to
**`#ffffff`** — correctly, because the tone exists for a solid brand surface. The two
tones were **interleaved across the same rows**, so those white buttons sat on Figma's
white canvas with nothing behind them: an invisible box whose only visible feature was
its shadow.

Not a component defect. A presentation defect in the set, and a real one — 180 variants
per set were unreadable.

**Fixed:** the grid is now `Sub-type × Size` across (9 columns) and `Type × State` down
(20 rows), with **Tone as two stacked blocks** and a brand ground painted behind the
second. The set had also kept the bounds of its old layout — 1376×2303 for 648×3040 of
content — so variants floated outside their own frame.

---

## 3. Ninety-six shadows the code has never rendered

| Set | Removed | Kept |
|---|---|---|
| Button | 24 hover elevations + 48 resting shadows on outlined/text | 72 focus rings |
| IconButton | 24 hover elevations | 72 focus rings |

Inherited from the UX4G set this descends from, then multiplied by the 45 → 180 → 360
rebuild, because **a clone brings its parent's effects with it**.

---

## 4. Two things I got wrong before checking

**The focus shadow is correct, and I had planned to replace it.** The first version of
this plan said "redraw `Focused` as the estate's focus ring rather than a glow". It
already is one: a `DROP_SHADOW` of spread 4, `#0373df` at 48% — and `--sa-focus-ring` is
`rgba(3, 115, 223, 0.48)`, the same colour. Deleting it would have removed the one effect
the code does draw. All 144 are kept.

**The defect was not confined to IconButton.** Button carried 72 of the 96 — including
resting shadows on outlined and text buttons, which nothing had reported because they are
subtle on a white page. Auditing the reported component alone would have fixed a quarter
of the problem and left the estate's most-used control wrong.

---

## 5. Still open

- [ ] **`IconButton — Documentation`** — the consumer-facing frame (hero, six counted
      stats, numbered `NN` sections, 880px measure). The **Component record** is authored;
      this is its other half. `ds-documentation-standard.md` §1 asks for both.
- [ ] **`Link — Documentation` and `Link — Component record`** — the Link set was rebuilt
      on 2026-09-03 and has neither.
- [ ] **The Scratch section.** `4 · Scratch — pre-2026 specimen boards, kept for
      reference, not published` is **8988 × 4459**, larger than the Button section. It is
      named honestly. **Not deleted** — it is somebody's reference material, and that is a
      human's call, not mine.

---

## 6. The rule this earns

**A clone inherits effects, and nobody looks at effects.** The 45 → 360 rebuild verified
fills, strokes, glyph ink, sizes and bounds — every property it deliberately set — and
carried a shadow through all of it because nothing asked. When cloning a variant, diff the
**full** property set against the source of truth, not the properties you are changing.

And the corollary, from §4: **when a defect is reported on one component, check its
siblings before believing it is confined there.** This one was three-quarters somewhere
else.

---

## 7. Second pass — alignment, Scratch, and the CloseButton question

### Icons were not positioned properly, and it was my grid

Variants sat at their cell's **top-left**, so a 32px Small and a 48px Large in adjacent
columns shared a top edge and not a centre line:

| | cx | cy |
|---|---|---|
| Small (32) | 16 | 16 |
| Default (40) | 92 | 20 |
| Large (48) | 168 | 24 |

Read across a row, the glyphs stepped down and to the right as the size grew. Every
variant is now centred in its 72px cell: `cy = 36` for all nine columns, `cx` stepping
36, 108, 180 … The cell is the unit; the control sits in the middle of it.

### Scratch is gone

`4 · Scratch — pre-2026 specimen boards` — 8988 × 4459, three frames: `Icon Buttons`
(1837×2477), `Buttons` (4834×4219), and an empty wrapper misnamed "Icon Buttons".
Removed on explicit instruction. The page re-stacks to three sections.

### Do we need a separate CloseButton? No.

Measured, not assumed:

| | Figma `CloseButton` | Reality |
|---|---|---|
| Variants | 45 — Size × Type × State | IconButton covers this and more (360) |
| `Type` options | Default, Outlined, **Tonal** | **Tonal was retired estate-wide in August** for a 1.21–1.52:1 edge |
| Intent axis | none | IconButton has four |
| Tone axis | none | IconButton has both grounds |
| Code counterpart | **none** | — |
| Instances on the Buttons page | **0** | — |

A close button is an icon button whose glyph is `close`. **31 call sites in code already
build it that way**, two of them through `IconButton`. The set is a stale duplicate
carrying a retired appearance, and it is the same shape of problem `Link` was: published,
findable, and unbuildable.

**Recommendation: delete the `CloseButton` set and its page.** Not done here — a published
set may hold instances on pages this session has not loaded, and `loadAllPagesAsync` is
not available, so file-wide verification needs a human with the file open.

### One page per component, not one page for the family

`ds-documentation-standard.md` §1 describes a **component page**: a Documentation frame, a
Component record, then numbered sections. Today `Button`, `IconButton` and `Link` share
the "Buttons" page while `CloseButton` has one to itself — the opposite of the rule, in
both directions at once.

**Recommendation:** one page each — `Button`, `Icon Button`, `Button Group`, `Link`. That
matches the estate's own code rule (`check:docs-routes`: one docs route per component) and
gives each component somewhere to put the two frames it owes.
