# Getting `ref/*` out of the library — the 2026-08-26 sweep

> **What this records.** A Tier-1 `ref/*` variable is a raw step. Nothing a designer
> touches should bind one: a component binds the role (`padding/16`, `bg/neutral/base`,
> `type/body/1/size`), the role binds the step, and the step is the only thing that knows
> the number. On 2026-08-26 the library did not work that way — in three separate ways,
> for three separate reasons. Two are closed. One is open, deliberately.

## 1 · The type scale and the weights were mis-tiered at the SOURCE — closed

`font.role.*` and `font.tracking.*` are authored in `primitive.json`, so `tierOfFile`
called them Tier 1 and the Figma exporter named them `ref/font/role/display/1/size`. But
`buildResponsiveType()` has always shipped them to CSS as the flat `--sa-type-*` scale
with **no** `ref` marker — the name apps consume and the docs quote. One token, two tiers.

`font.weight.*` was worse: a weight is a ROLE — a brand pack that ships a heavier body
face changes it — and it sat at Tier 1 with no Tier-2 alias at all.

**Consequence, and it was not carelessness:** all 24 Noto Sans text styles bound `ref/*`
because a text style must name a cut and a size, and the library offered nothing else.

**Fixed by renaming, not by adding a layer** — two names for one value is the defect this
repo already refuses elsewhere:

| was | is | why |
|---|---|---|
| `ref/font/role/<role>/<n>/<part>` | `type/<role>/<n>/<part>` | matches `--sa-type-*`, which `fromCssName` already parses back to `type/…` |
| `ref/font/tracking/<key>` | `type/<key>/tracking` | same |
| `ref/font/weight/*` | `font/weight/*` | moved file to `semantic.json`; `--sa-font-weight-*` is also the name the UX4G parity layer was already reaching for |

79 variables renamed in Figma, unhidden, codeSyntax refreshed. The four weight renames
were **proven value-preserving** against the un-regenerated visual contract before it was
rebaselined. All 31 text styles were then rebound family-first onto `font/latin`,
`font/display` and `font/icon`.

**Zero text styles bind a `ref/*` today, where 31 did that morning.**

## 2 · 20,653 canvas bindings reached a raw step — closed, value-preserving

A sweep of all 68 content pages found spacing and radius bindings pointing straight at
`ref/space/*`, `ref/radius/*` and `ref/size/*`. The remap is mechanical because the
correct target is derivable from the property itself:

| bound property | target | how the axis is decided |
|---|---|---|
| `padding{Left,Right,Top,Bottom}` | `padding/<n>` | — |
| `itemSpacing` | `inline/<n>` or `stack/<n>` | the layer's own `layoutMode` — horizontal gaps are inline, vertical gaps are stack |
| `counterAxisSpacing` | the other one | the wrap axis is the opposite of the primary |
| `cornerRadius`, `*Radius` | `shape/<n>` | — |

Every rebinding was **value-checked before it was made**: both variables were resolved
through their alias chains and had to land on the same single number in every mode. A
mismatch was skipped, not guessed.

**Result: 20,653 bindings across ~5,668 layers on 68 pages. Zero failures.** The heaviest
were Charts & Graphs (6,596), List (3,028), Iconography (2,134), Navbar (1,166) and
Date-Time Picker (1,047). Buttons rebound nothing — its `ref` debt is entirely colour.

Verified by screenshot on the Navbar and Typography documentation frames: nothing moved,
which is what a value-preserving remap should look like.

### What the sweep deliberately did NOT touch

- **`ref/size/*` on width, height and padding** — the `size` ladder has steps the spacing
  ladder does not (10, 14, 20, 24, 28), so there is no Tier-2 token to point at. Minting
  one per orphan step would inflate the palette to fix a name. Left, and listed here.
- **Inert `itemSpacing` bindings on frames with auto-layout off** (~750). The property
  governs nothing, so re-pointing it is theatre; removing the binding is the real fix and
  is a separate decision.
- **The five separator pages** (`------`). No content.

## 3 · ~2,000 colour bindings still reach `ref/color/*` — OPEN, and it needs a designer

The remainder is colour, and it is not mechanical. `ref/color/ink/dark`,
`ref/color/{primary,danger,success,neutral}/source`, `ref/color/stroke/100` and
`ref/brand/samavesh/*` are hand-made library variables from before the token pipeline, and
**none of them has a Tier-2 alias to fall back on**. Choosing the right target means
deciding, per component and per state, whether a fill is `cmp/action/*`, `bg/*`, `text/*`
or `border/*` — the same judgement the Button's 135 filled variants already got by hand.

Buttons alone holds 988 of these. A script could guess; a wrong guess would be a silent
visual change in a shared library, which is worse than the debt it removes.

**Also open, and much smaller:** ~60 `fontFamily` bindings per heavy page reach
`ref/font/family/*` directly. Those DO have a unique Tier-2 alias (`font/latin`,
`font/display`, `font/icon`), so they are one value-preserving pass away.

## 4 · The guardrail, so this cannot come back the same way

Every Tier-1 variable in the library is now **hidden from publishing** — 12 were still
exposed (`ref/brand/samavesh/*`, `ref/brand/digilocker/purple`, three `ref/breakpoint/*`)
and were hidden in the same pass. A consuming file cannot bind a reference token at all.

Hiding does not stop a binding made **inside** this file, which is exactly how the debt
above accumulated. The rule that covers that is `.claude/rules/component-authoring.md`.
