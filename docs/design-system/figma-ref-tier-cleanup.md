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

**THE BUTTON, corrected.** An earlier reading of this said ~400 button *backgrounds* sat on
the raw primary. That was wrong, and the error is worth naming: the audit counted every
`ref/color/primary/source` binding on the Buttons page, and most of them were the ICON vectors
inside buttons, not the button's own fill. The `Button` set's filled variants already bound
`cmp/action/brand/primary/*/bg` and already painted the code's #005EB9.

What actually remained was **`IconButton`, 15 fills**, and it was worse than a tier problem:
every state painted the same `primaryScale/500`, so a **disabled** icon button rendered in
full-strength brand blue. Now bound to the matrix — default #0373DF → **#005EB9**, hover
→ #004B96, pressed → #003975, disabled → #C6C9CD.

**THE OUTLINED AND TEXT STATES — closed 2026-08-26, 639 bindings.** Border and label had sat
on ONE variable across every state, so Hover, Pressed, Focused and Disabled were
pixel-identical to Default while the code rendered four distinct values. Every variant is now
bound to `cmp/action/<family>/<sub-type>/<state>/<slot>`, derived from its own variant name:
Filled→primary, Outlined→secondary, Text→tertiary, Tonal→tonal; Pressed→active;
**Focused→default**, because the code renders focus as the default colours plus a ring.

The visible movement, all of it toward what the code already paints:

| | default | hover | pressed | disabled |
|---|---|---|---|---|
| outlined border (success) | `#00542B` → `#659C77` | → `#3B8155` | → `#046A38` | → `#C6C9CD` |
| label (success) | `#00542B` → `#004220` | unchanged | → `#003318` | → `#1E2124@0.48` |
| label (primary) | `#0373DF` → `#004B96` | unchanged | → `#003975` | → `#1E2124@0.48` |

**And one defect nobody had reported: the Neutral text and outlined buttons were painting
their labels BRAND BLUE** (`#0373DF`), 48 bindings. A neutral action is the one that must
carry no semantic charge — `design.md` argues exactly this about the variant's existence —
and it was the loudest colour in the set. Now ink (`#1E2124`) and subtle ink on outlined.

**Zero `ref/color/*` bindings remain anywhere on the Buttons page.**

### What is left, counted rather than estimated

A full sweep on 2026-08-26 puts the remaining `ref/color/*` and `ref/brand/*` bindings at
**2,986**, and they are not one problem:

| population | count | why it is still there |
|---|---|---|
| ~~`ref/brand/samavesh/*`~~ | ~~1,700~~ | **closed** — see below |
| `ref/color/stroke/{300,600}` | ~50 | no Tier-2 rung exists at those steps; `stroke/400` is closed |
| `ref/color/{primary,success,danger}/source` outside buttons | ~500 | charts, list rows, chips, steppers, avatars. A fill has a value-preserving target (`bg/status/*/bolder`); a LABEL in the same colour does not, so the two halves need separate answers |
| `ref/color/ink/primary`, `ink/light` | ~120 | no Tier-2 token resolves to the same value in both brands |
| `stroke/50` on strokes | 15 | the neutral border family has no rung at 50 |

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
- `border/brand/primary/subtle` `#0373DF@0.45` — **deleted**. Figma-only, no source entry, so
  no push could reach it; on Navy it painted a Blue-brand border where Navy's primary is a
  different hue entirely (`#244C7B`). It was **not unused** — a first sweep found 8 annotation
  connectors on the Accessibility Bar documentation page bound to it. Deleting a bound variable
  is precisely what strands a node on a ghost, so they were rebound first, to
  `bg/brand/primary/bolder` — the token their own numbered pins already use, which makes a
  leader line and its pin the same colour instead of a translucent near-miss. Zero dangling
  aliases confirmed on a re-read.

**The general rule this leaves behind:** an `rgba()` in `semantic.json` is a brand trap. If
the colour it tints varies by brand, it needs a `colorModes.navy` value, or it silently
ships the Blue value to every other brand.

## 3c · The mark colours — minted, and the record was wrong about why they were absent

The nine `ref/brand/*` variables were **Figma-only**, hand-made since before the pipeline, and
the repo's own note explained the gap as *"library-only BY DESIGN: a partner or seal colour
never re-themes, so it is authored in Figma and not projected from code."*

That reasoning is right about the values and wrong about where they live. **Never re-theming is
a fact about the token, not a reason to keep it out of code.** The proof it had gone wrong:
all nine carried a `codeSyntax` of `var(--sa-ref-brand-samavesh-*)` — CSS variables **no
stylesheet had ever declared**. The library was pointing developers at names that did not exist.

They are now authored in `semantic.json` as `brand/*` and routed to **Static**, which is
mode-less — the correct home for a value that must never move, and a much better argument than
"it lives in Figma". Three consequences worth stating:

- **The rename carried all ~1,700 bindings for free.** Renaming a variable keeps its id, so
  Portal Login's 1,036 uses, the Navbar's 296 and the rest moved without touching a node.
- **`brand` had to be registered in the naming grammar**, and the reason is a real distinction:
  a colour ROLE says what a colour is FOR and re-themes; a MARK colour says what a logo IS and
  must not. That is also why its second segment is an ORGANISATION (`brand/samavesh/ink`)
  where a role takes a family — position keeps them readable apart.
- **Static is now byte-identical between payload and library**, so its `knownDifference` entry
  was deleted rather than updated. A stale exemption hides the next real difference.

The ink is worth repeating: **`#1F2428` for the mark, `#1E2124` for text.** Two colours that
survive any review by looking the same.

## 4 · The guardrail, so this cannot come back the same way

Every Tier-1 variable in the library is now **hidden from publishing** — 12 were still
exposed (`ref/brand/samavesh/*`, `ref/brand/digilocker/purple`, three `ref/breakpoint/*`)
and were hidden in the same pass. A consuming file cannot bind a reference token at all.

Hiding does not stop a binding made **inside** this file, which is exactly how the debt
above accumulated. The rule that covers that is `.claude/rules/component-authoring.md`.
