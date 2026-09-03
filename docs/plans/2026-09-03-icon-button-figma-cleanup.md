# IconButton — the Figma half, and why the app was never broken

**Branch** `ds/icon-button-cleanup` · **Opened** 2026-09-03 · **Status** blocked on the
Figma MCP call limit; every measurement below is already taken.

Reported in review with a screenshot: an icon button drawn as a **white box with a heavy
drop shadow**, beside two bare glyphs with no container and one blue outlined box.

---

## 1. The app is not broken. Measured, not assumed.

`/design-system/components/actions/icon-button`, computed styles from a real browser:

| | background | border | box-shadow | radius | box |
|---|---|---|---|---|---|
| Filled, rest | `rgb(0,94,185)` | same | **none** | 8px | 40×40 |
| Filled, hover | `rgb(0,94,185)` | same | **none** | 8px | 40×40 |
| Filled, focus | `rgb(0,94,185)` | same | **none** | 8px | 40×40 |
| Outlined, rest | transparent | `rgb(0,94,185)` | **none** | 8px | 40×40 |

Blue fill, white glyph, square, no shadow, no white box. The screenshot is of the **Figma
set**, not the running component.

---

## 2. What is actually wrong, and it is all in Figma

### F1 — 96 of 360 variants carry effects the code does not render

Drop shadows on `State=Hover` and glows on `State=Focused`, inherited from the UX4G set
this component descends from and then multiplied by the 45 → 180 → 360 rebuild, because a
clone brings its parent's effects with it.

The code renders **`box-shadow: none` in every state** (measured above). Its focus is an
`outline` bound to `--sa-focus-width` / `--sa-focus-offset`, not a glow, and its hover is
`filter: brightness(0.95)`, not elevation.

So the white-box-with-shadow in the report is a Figma variant painting an affordance the
estate does not have. **This is the defect.**

### F2 — no `— Documentation` or `— Component record` frame

`ds-documentation-standard.md` §1 requires both on every component page. The Buttons page
has them for **Button only**; IconButton and Link are sections on the same page with
neither. Three components, one component's documentation.

### F3 — a Scratch section is still published alongside the real sets

`4 · Scratch — pre-2026 specimen boards, kept for reference, not published` is **8988 ×
4459** — larger than the Button section itself. It is named honestly, which is better than
most, but it sits in the same file a designer opens to find the master.

### F4 — what is already right, and should not be touched

- 360 variants, complete `Size × Sub-type × State × Type × Tone` matrix
- Fills bound per intent: `cmp/action/{brand,success,destructive,neutral}/primary/<state>/bg`
- Sections numbered `1 · Button`, `2 · IconButton`, `3 · Link`, `4 · Scratch` — the page IS
  organised; the earlier work landed
- The library `Icon` in every slot, zero orphans

---

## 3. The pass, when the call limit resets

Each step is one `use_figma` call, and each is verified in a SEPARATE call — mid-script
reads of Figma getters proved unreliable during the Button work and cost two wrong
conclusions.

- [ ] **S1** Strip `effects` from all 96 variants. Assert `effects.length === 0` across all
      360 afterwards, in a fresh call.
- [ ] **S2** Redraw `State=Focused` as the estate's focus ring — a 2px outline offset 2px,
      bound to `--sa-focus-ring` — rather than a glow, so the drawn state matches what a
      keyboard user actually sees.
- [ ] **S3** Author `IconButton — Documentation` and `IconButton — Component record` to the
      house style: 1680 wide, hero with six COUNTED stats, numbered `NN <claim>` sections,
      880px prose measure.
- [ ] **S4** Same for Link, whose set was rebuilt on 2026-09-03 and has no frames either.
- [ ] **S5** Move the Scratch section to its own page, or delete it against the human's
      explicit say-so. **Not deleted unilaterally** — it is somebody's reference material.
- [ ] **S6** Re-verify: 360 variants, zero effects, all fills/glyph inks bound, heights on
      the ladder, and no descendant exceeding its instance bounds.

**Do not** change fills, the variant matrix, or the icon instances. Those are correct and
were verified on 2026-09-03.

---

## 4. The rule this earns

**A clone inherits effects, and nobody looks at effects.** The 45 → 360 rebuild verified
fills, strokes, glyph ink, sizes and bounds — every property it deliberately set — and
carried a shadow through all of it because nothing asked. When cloning a variant, diff the
FULL property set against the source of truth, not the properties you happen to be
changing.
