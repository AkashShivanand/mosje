# Documentation must be BUILT from the design system, not just look like it

**Scope — every documentation surface in the estate:**

- the SAMAVESH **Figma library** documentation pages (`Typography`, `Navbar`, `Motion`,
  `Density`, `Color Styles`, and every page added later)
- the **web hub** design-system docs (`apps/hub/src/app/design-system/**`)
- any Storybook doc page, spec page, or report page we author

## The rule

**Not a single element may be unlinked from the design system.** Every visual property
must resolve through a token, a variable, or a DS component — never through a literal
value that happens to match one.

This is not a style preference. A hex that *equals* `#1e2124` today is not the same
thing as a binding to `text/neutral/bolder`: when the token moves, the binding follows
and the literal silently stops matching. Documentation that drifts from the system it
documents is worse than no documentation, because people trust it.

### Figma documentation pages

| Property | Must bind to | Never |
|---|---|---|
| Text | a **published text style** (`Body/body-1`, `Headline/headline-3`, …) | a hand-set family/size/weight |
| Fill, stroke | a **Color / Palette variable** (`bg/neutral/subtle`, `text/status/error/base`) | a raw hex |
| Padding, gap | a **Space variable** | a typed number |
| Corner radius | a **Radius variable** | a typed number |
| Elevation | a **published effect style** | a hand-built shadow |

Sizes must exist **on the 21-role scale**. If a caption "needs" 13px, the answer is
`body-2` at 14 or `body-3` at 12 — not a 22nd size invented for one card. Nothing may
render below **11px** (`label-3`), which is the estate's stated floor.

### Web documentation pages

- Style through **DS components** (`Callout`, `DoDont`, `A11yChecklist`, `TokenTable`, …)
  and the `docs-kit` class layer first. Reach for markup of your own only when nothing fits.
- Any CSS value must be `var(--ds-*)` / `var(--sa-*)`. **No raw hex, no raw px, no
  arbitrary rem.**
- Anything reusable that you had to hand-roll belongs in `docs-kit` or
  `packages/design-system` **before** you use it — see the design-system-first rule in
  `CLAUDE.md`.

## The one exemption: specimens

A documentation page about type has to be able to *show* type. Three cases legitimately
carry off-role values, and only these three:

1. **A specimen demonstrating a non-role value** — an interpolated fluid size (57.7px at
   768px), a portal-vs-website comparison, the "wrong" half of a do/don't pair.
2. **A face the library cannot hold** — `--ds-font-mono` is a *system stack*, so
   `ref/font/family/mono` is hidden from publishing and has no Figma family. A mono code
   sample uses a stand-in face and says so.
3. **A script with no published role styles yet** — currently Devanagari.

**An exemption must be declared, never merely present.** Name the node so an audit can
account for it:

```
specimen (off-role, intentional) — <first words>
code sample (mono, no Figma family) — <first words>
specimen (Devanagari, no role style) — <first words>
```

An unbound node that is not named this way is a **defect**, not a specimen. The audit
below reports it as `UNACCOUNTED`, and `UNACCOUNTED` must be zero.

## Thresholds

| Surface | Requirement |
|---|---|
| Fills, strokes, padding, gaps, radii (Figma) | **100 % bound.** No exceptions — these are never specimens. |
| Text nodes (Figma) | 100 % either bound to a text style **or** carrying a declared specimen name. |
| Raw hex / raw px in web docs | **zero** |
| `UNACCOUNTED` nodes | **zero** |

## How to check

Run the linkage audit against the frame before calling a documentation page done. It
walks every `TEXT` and `FRAME`, counts bound vs raw for each property, and buckets
unbound text into *specimen / code sample / UNACCOUNTED*. On the web side:

```bash
grep -nE '#[0-9a-fA-F]{3,6}|[0-9]+px' apps/hub/src/app/design-system --include=*.tsx -r
```

Every hit must be inside a token definition or a documented specimen.

## Bind by RESOLVED VALUE, not by name

Binding is necessary but not sufficient: **a binding can be the wrong binding.** Semantic
slot names describe prominence in product UI, and they do not mean what a documentation
layout assumes they mean. Resolve the variable and compare it to the appearance you
intend before you bind.

This was learned by breaking the Typography page. Mapping the documentation palette to
semantics that *sounded* right produced:

| Intended | Bound to | Actually resolved to |
|---|---|---|
| `#ecf4ff` pale hero tint | `bg/brand/primary/subtle` | **`#95c2fb`** — a saturated blue hero |
| `#0373df` pill | `bg/brand/primary/base` | **`#ecf4ff`** — near-white pill, unreadable |
| `#eef0f3` panel | `bg/neutral/subtle` | **`#dcdee1`** |
| `#1e2124` ink | `text/neutral/bolder` | **`#0e1114`** |
| `#fef2f1` tint | `bg/status/error/subtle` | **`#ff9d8f`** — an alert, not a card |

Every one of those was 100 % "linked" and 100 % wrong. The correct targets — verified by
resolving each — were `bg/brand/primary/base`, `color/primaryScale/600`,
`bg/neutral/subtler`, `text/neutral/base`.

**Procedure:** resolve every candidate to a hex (following aliases to the end), pick the
variable whose resolved value matches the intended appearance *and* whose name matches the
intent, and only then bind. If nothing resolves to the intended value, the intended value
was never a design-system colour — change the design, do not add a variable for it.

### Restraint beats tint

Where the system has no pale status tint, do not reach for the strongest one it does have.
The `Colour` documentation page carries do/don't signals in a **coloured label and border on
a neutral card** (`bg/neutral/subtler`, no status fill), and reserves `bg/status/*/subtler`
for callouts that are meant to dominate. Typography now follows the same treatment. A
tinted fill across a whole card or data row overwhelms the specimen it is meant to frame.

### Do not flatten alignment in bulk

Setting `counterAxisAlignItems` across every horizontal row at once destroyed the centring
on eyebrow rows, role-plus-token rows and table rows. The reference page runs
**MIN 74 / CENTER 5 / BASELINE 14** — mixed by intent. The working rule: a row whose
children are all text (or text plus a pill) is **centred**; a row of cards is **top-aligned**.

## Why this rule exists

The Typography documentation page was audited on **2026-08-11** and scored **1.0 %
linked** — 29 of 2,902 bindable properties. It carried:

- **0 of 706** fills bound; 15 hardcoded hexes, **7 of which existed in no collection at all**
- **0 of 1,356** paddings, **0 of 339** gaps, **0 of 129** radii bound
- **29 of 556** text nodes on a published style
- invented sizes **13px, 15px, 18px**, and **10px in 11 places** — on the page that
  declares 11px the floor
- a "monospace" specimen card that was not rendering in monospace

It looked correct, because the literals were copied from the right values. It was
structurally detached from every one of them. The `Navbar` documentation page, built
earlier, was **85 % bound on fills and 43 % on text** — the precedent was better than
what replaced it, which is exactly how this kind of drift goes unnoticed.

Remediated the same day to **93.6 % overall**, 100 % on every non-text property, with
every remaining unbound node declared as a specimen and zero `UNACCOUNTED`.
