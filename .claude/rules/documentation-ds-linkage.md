---
paths:
  - "apps/hub/src/app/design-system/**"
  - "apps/hub/src/components/design-system/**"
  - "packages/design-system/**"
  - "tools/ds-linkage/**"
---

# Documentation must be BUILT from the design system, not just look like it

**Scope — every documentation surface in the estate:**

- the SAMAVESH **Figma library** documentation pages (`Typography`, `Navbar`, `Motion`,
  `Density`, `Color Styles`, and every page added later)
- the **web hub** design-system docs (`apps/hub/src/app/design-system/**`) and the
  docs chrome they are built from (`apps/hub/src/components/design-system/**`)
- the **design-system package itself** (`packages/design-system/components|foundations`) —
  gated since 2026-08-12; it is not documentation, but it is the thing the documentation
  documents, and it was the worse offender of the two
- any Storybook doc page, spec page, or report page we author

## Order everything (MANDATORY)

Every list on a documentation surface — colour shades, token maps, property tables,
value lists, swatch rows, section sequences — is ordered **logically, never by
insertion**, per `.claude/rules/component-authoring.md` §10:

- **Colour shades** ascend by value, lightest first: `base → subtler → subtle → bold →
  bolder → boldest` (rungs 50 → 800; neutral omits `bolder`/`boldest`). `base` is the
  lightest rung, so it leads — matching the `Colour` documentation page.
- **Space / radius / numeric scales** ascend by value.
- **Variants / breakpoints** by their natural scale (e.g. `Mobile → Desktop XL`).
- **No natural scale** → alphabetical.

Two lists of the same things use the same order. Random ordering is a defect, the same
as an unbound literal.

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
| Raw fills, strokes, padding, gaps, radii in web docs | **zero** — enforced by `npm run check:ds-linkage` |
| `UNACCOUNTED` nodes | **zero** |

Note the web row says *fills, strokes, padding, gaps, radii*, not "raw px". It used to say
raw px, which was never achievable and therefore never enforced: a grid track of
`minmax(180px, 1fr)` and a `640px` breakpoint are not token material, and a threshold
nobody can hit is a threshold nobody runs. See **What is gated** below.

## How to check

**Figma:** run the linkage audit against the frame before calling a documentation page
done. It walks every `TEXT` and `FRAME`, counts bound vs raw for each property, and
buckets unbound text into *specimen / code sample / UNACCOUNTED*.

**Web: run the gate. Do not grep.**

```bash
npm run check:ds-linkage
```

`tools/ds-linkage/check.mjs` runs in `npm run check` and in the **Design System Quality**
workflow, so this rule now fails a pull request instead of being rediscovered by audit.
It replaces the grep that used to live here, which was wrong in both directions: it
flagged every prose mention of "the 8px grid" as a violation, and it missed the two forms
that actually caused the drift —

- `style={{ … }}` objects and Tailwind arbitrary values, which are code, not stylesheets;
- **bare numerics**: React turns `fontSize: 13` into `13px`, so a grep for `px` can never
  see it. There were **64** of these when the gate was first run.

It also scans `.css`, which the grep never did, and that is where most raw values were.

### What is gated, and what is only reported

| | |
|---|---|
| **Gated** — fails the build | fills, strokes, padding, margin, gaps, radii — the properties this rule's own table names |
| **Advisory** — reported, does not fail | widths, heights, grid tracks, media-query breakpoints, blur radii, shadow offsets |

The split is deliberate. Those advisory values are geometry the token scales do not
model, and minting a one-use token for each would inflate the palette — which the
"bind by resolved value" section below warns against. Forcing them through the gate
would produce a wall of exemptions, and a gate everyone learns to silence is not a gate.

### Declaring an exemption in code

Same principle as Figma: **declared, never merely present.** The reason must say *why*,
and a category the checker does not recognise is itself a failure.

```tsx
// ds-exempt(specimen): 13px and 11px are the POINT of this example — the "don't"
// half of a do/don't pair. Binding them would delete what is being demonstrated.
<div style={{ gap: "13px", padding: "11px" }}>
```

```css
/* ds-exempt-start(third-party): macOS window-control colours, quoted so the block
   reads as a terminal. A reference to another product's chrome, not ours. */
…
/* ds-exempt-end */
```

Categories: `specimen`, `code-sample`, `demo-geometry`, `third-party`, `layout-literal`,
`optical` (a 1–2px nudge that aligns a glyph, where the 2px token would misalign it).

### Scope is checked, not assumed

A scope path that cannot be read is a **hard error** (`exit 2`), not a skipped scope.
The first version of this checker pointed at `packages/design-system/src`, which has
never existed, and it cheerfully reported that scope clean. A gate that cannot fail is
worse than no gate.

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

## What the first gated run found (2026-08-12)

The rule had been written, and the Typography page remediated, but nothing enforced it on
the web side. Ten weeks later the first run of `check:ds-linkage` across the whole
documentation surface — 37 pages plus the docs-kit and docs chrome — found **352**
unbound values in styling positions:

- **64 bare numerics** (`fontSize: 13`, `gap: 8`) — invisible to any grep for `px`, which
  is exactly why the previous check never saw them.
- **The same six-hex code palette hand-rolled in THREE places** independently — the home
  page, the contributing page and the playground — with two different "terminal black"
  values (`#12141c`, `#1e2130`) that were never meant to differ. There was no `code/*`
  namespace to bind to, so everyone invented one. There is now.
- **42 `var(--token, fallback)` fallbacks, 15 of which disagreed with their token.**
  `--sa-shape-sm` fell back to `4px` against a real `6px`; `--sa-color-status-danger` fell
  back to a bright `#DC2626` against a real `#8b1f18`. A fallback is a second, stale copy
  of a value that no build ever checks — treat it as a defect, not a safety net.
- **`56px` written out in seven files** as the docs header height, so changing the header
  silently broke anchor scrolling in six of them.
- Two accessibility defects found by measuring rather than by looking: the terminal
  titlebar at `rgba(255,255,255,0.4)` was **4.1:1**, below AA (now 4.52:1), and a WCAG
  badge was set at **10px**, under the 11px floor the Typography page itself declares.

Two lessons worth keeping:

1. **A rule with no gate is a rule with a half-life.** This one was written the day a page
   scored 1.0 % linked, and the surface it governed drifted anyway, because the only check
   was a grep in a markdown file that nobody ran and that would have been wrong if they had.
2. **Bind by resolved value — including when the value is a theme.** Two bindings made
   during this sweep were caught by arithmetic, not by eye: `--sa-on-bg-neutral-bold`
   would have put `#1e2124` ink on a `#3a3d41` chip (**1.48:1**, invisible), and
   `--sa-bg-neutral-base` inside a `[data-theme="dark"]` rule resolves to **white**,
   because `tokens.css` emits no `[data-theme]` block at all. Both looked correct by name.

## What gating the PACKAGE found (2026-08-12)

The documentation was fixed first and the package left advisory, on the assumption that the
shipped library — which already had a stylelint raw-hex gate — was in better shape. It was
not. **472 gated findings**, against 352 for the docs.

The stylelint gate was real but narrow: it reads component *stylesheets*, so it never saw
inline `style={{}}` objects, `var()` fallbacks, or padding and gap literals. Nearly
everything lived in those three blind spots.

- **Seven `--color-*` names were defined NOWHERE**, so their hardcoded fallbacks were what
  actually painted. All 16 usages sat in `PortalLoginShell` — the login page every portal
  renders — which meant that screen was drawn in Tailwind-default slate and an off-brand
  navy and saffron that no token, and no brand switch, could reach. A `var()` fallback does
  not just risk being stale; when the name is dead it **is** the value.
- **Four WCAG AA failures on that one screen**, none visible without measuring: hint text at
  **2.56:1**, a section label at **3.53:1**, a badge at **3.56:1**, and bold saffron text
  that was fine until it was bound — see below.
- **231 fallbacks, 128 disagreeing with their token**, mostly stale px left behind when the
  type scale went fluid: `--sa-type-title-1-size` falling back to `16px` against a `clamp()`
  that resolves to 18px and up.
- **85 declarations off the 8px grid** — 3, 5, 6, 7, 10, 11, 13, 14, 18px — in the library
  whose own Spacing page tells everyone not to do that.

### Two rules this pass added

**Bind to the step that matches the SURFACE, not the swatch name.** The saffron in the login
hero was mapped to `secondaryScale-600` because that is the on-white step, and it sits on a
dark panel: **4.93:1 → 3.13:1**, a regression introduced *by* binding it. The light step
(`-400`) measures **6.63:1** live. A ramp has a light end and a dark end, and which one is
correct is a property of the background, not of the token's name.

**Prefer an exact cross-family token over an inexact same-family one.** `padding: 40px` has
no step in the padding scale but is exactly `stack/2xl`; `48px` is exactly `section/m`; a
`20px` gap is exactly `padding/l`. Binding across the family keeps the pixels identical,
where snapping within the family would have moved them for no reason. Snap only when nothing
in the system holds the value.

