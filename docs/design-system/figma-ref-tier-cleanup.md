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

## 3 · The colour bindings — 4,552 swapped, the rest is a design decision

**Phase A ran on 2026-08-26 across every page: 4,552 bindings swapped, zero failures.** The
rule is property-driven and the same shape as the spacing one — what a colour IS depends on
where it is painted:

| ref | on TEXT | on a vector | on a stroke | on a container fill |
|---|---|---|---|---|
| `ink/dark`, `neutral/source` | `text/neutral/base` | `icon/neutral/base` | — | no target |
| `ink/hint` | `text/neutral/subtle` | `icon/neutral/subtle` | — | no target |
| `primary/source` | `text/brand/primary/base` | `icon/brand/primary/base` | `border/brand/primary/base` | **Phase B** |
| `stroke/50` | — | — | no target | `bg/neutral/subtler` |
| `stroke/100` | — | — | `border/neutral/subtle` | `bg/neutral/subtle` |
| `stroke/200` | — | — | `border/neutral/base` | `bg/neutral/bold` |

Every target was checked to be **alias-backed and brand-following** before use, and every
swap was value-checked in BOTH brand modes — a swap onto a frozen literal would have been a
regression dressed as a cleanup. Paints were rebound with `setBoundVariableForPaint` and the
array reassigned; a mutated-in-place paint array silently does nothing.

Verified by rendering Button variants before and after: filled, outlined, text and neutral
all unchanged.

### What Phase A deliberately left — it is a decision, not a swap

**~400 BUTTON BACKGROUND fills.** There is no Tier-2 token at the same value: the library
paints primary at `primaryScale/500` (#0373DF) while the code paints #005EB9 (600). Binding
the Tier-3 action matrix `design.md` prescribes fixes the tier AND makes Figma agree with the
code — but primary buttons visibly darken. Success and danger already agree (the library was
right and the code caught up, v0.34.0), so only primary moves. That is a design call.

**~450 bindings with no Tier-2 home at all** — `ref/brand/samavesh/{ink,blue,green,orange,saffron}`
and `ref/color/badge/beta`. Note the SAMAVESH mark's ink is `#1F2428`, which is NOT the text
ink `#1E2124`: they are different colours that look identical in review. These need tokens
minted in the source first.

**15 `stroke/50` strokes** — the neutral border family has no rung at 50.

### The font-family pass — closed, and it taught the audit a lesson

Run over **all 73 pages** (every page in the file, separators and section headers
included). **216 text ranges rebound** onto `font/latin`, `font/display` and `font/icon`,
on four pages only: Ticker 147, New in 2.0 55, Footer 8, Navbar 6. Zero failures, zero
remaining on re-audit.

**It is a RANGE-level property, and reading it the obvious way lies.** A text node's
`boundVariables.fontFamily` is an ARRAY, and it keeps reporting the variable a node was
built with even after the binding is gone — the Navbar showed 49 `ref/font/family/*`
entries whose ranges all resolved to `font/latin` when asked properly. The truth is
`getRangeBoundVariable(start, end, 'fontFamily')` per styled segment, and the write is
`setRangeBoundVariable`. A `setBoundVariable` on the node does nothing here: the first
pass rebound 0 of 1,046 nodes and reported success, which is exactly what a wrong audit
looks like.

## 3a · The icon styles, and the one axis nobody can bind

`Icon/{16 · 20 · 24 · 32 · 40 · 48 · 64}/{Outline · Filled}` — 14 styles, **size as the
folder and the cut as the leaf**, so both cuts of one size sit together where a designer
switches between them.

`FILL 1` was applied by hand (the Plugin API exposes no font-variation axis, and no Figma
variable scope exists for one). Verified by rendering all seven sizes of both cuts.

**The part worth recording:** applying the axis by hand silently **cleared the `fontStyle`
binding on all seven Filled styles**. They still rendered at Light, so nothing looked
wrong — only a binding audit caught it. Re-binding the weight afterwards is safe; the
axis survives, confirmed by rendering before and after. Order of operations: create,
apply FILL, re-bind the weight.

## 3b · The colour audit — what a raw hex does when the mode changes

The question that prompted this: some Tier-2/Tier-3 colours hold a **raw hex** instead of an
alias. What happens on a brand switch?

**First, the shape of the system.** The **Color** collection has exactly ONE mode
("Default"). It is not brand-aware at all. Every brand switch happens by *aliasing* into
**Palette**, which carries `Blue` and `Navy`. 361 of 481 Color variables alias, and those
follow the brand correctly.

**So a literal in Color is frozen** — permanently, at whatever brand was current when it was
typed. 120 of 481 are literals. Classified:

| class | count | verdict |
|---|---|---|
| fully transparent `#000000@0` | 40 | correct — a "no fill" sentinel has no brand |
| white at alpha (the `inverse` family) | 55 | correct — white on any brand is the point |
| chart categoricals + `cmp/badge/beta/bg` | 23 | correct, and worth stating: a category must NOT change hue when the brand changes, or last month's chart stops matching this month's |
| **translucent tints of brand-aware colours** | **2** | **defects** |

The two defects are the interesting ones, and they share one cause: **Figma cannot express
"alias plus alpha"**. A translucent token can therefore only be a literal — and a literal in
Color cannot move with the brand.

- `overlay/neutral/boldest` `#1E2124@0.50` — **fixed**. It has a code counterpart, so the fix
  is at the source: authoring a `navy` override makes the exporter emit a brand-aware
  companion in **Palette** and alias the Color token to it. That mechanism already existed;
  the token simply never had a second value to trigger it. Navy now gets `#1E2024@0.50`.
  `focus/ring` is the precedent — a literal, but living in Palette with a value per brand.
- `border/brand/primary/subtle` `#0373DF@0.45` — **open, and it is Figma-only**. It has no
  entry in the token source, so it cannot be fixed by a push. On Navy it paints a Blue-brand
  border, and Navy's primary is a different hue (`#244C7B`), so this one is visible. It needs
  a human decision: author it in the source with both brand values, or delete it if nothing
  binds it.

**The general rule this leaves behind:** an `rgba()` in `semantic.json` is a brand trap. If
the colour it tints varies by brand, it needs a `colorModes.navy` value, or it silently
ships the Blue value to every other brand.

## 4 · The guardrail, so this cannot come back the same way

Every Tier-1 variable in the library is now **hidden from publishing** — 12 were still
exposed (`ref/brand/samavesh/*`, `ref/brand/digilocker/purple`, three `ref/breakpoint/*`)
and were hidden in the same pass. A consuming file cannot bind a reference token at all.

Hiding does not stop a binding made **inside** this file, which is exactly how the debt
above accumulated. The rule that covers that is `.claude/rules/component-authoring.md`.
