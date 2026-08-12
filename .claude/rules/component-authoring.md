---
paths:
  - "packages/design-system/**"
  - "packages/tokens/**"
  - "packages/config/**"
---

# Component authoring standard (MANDATORY — every component created or updated, in Figma **and** code)

> Adopted 2026-08-12 after rebuilding the **AccessibilityBar** to industry standard.
> This rule is the checklist any component must pass before it is considered done.
> It applies to the SAMAVESH Figma library (`3FF5l0SMNIwdpZrKkeyPTm`) and the code
> mirror in `@mosje/design-system`. When a step cannot be met, **stop and surface it
> to the human — never guess and never ship a silent gap.**

The benchmark is the best design systems in the industry (Material 3, IBM Carbon,
Shopify Polaris, Atlassian, GOV.UK) **plus** UX4G/GIGW for government fitness. "Good
enough" is not the bar; "would this survive review in Carbon/Polaris" is.

## 0. Discover before you build (no writes until this is done)

1. **Read the reference.** If a UX4G (or other) source component exists, pull its
   real anatomy, tokens, variants, and properties (`get_design_context`,
   `get_variable_defs`, `get_metadata`) — every breakpoint/state, not one.
2. **Read the library.** Enumerate the token collections and existing components you
   will reuse. Confirm the nested pieces (icons, dividers, inputs, …) exist **as
   library components/tokens** before assuming them.
3. **Read the system's own contract.** `packages/design-system/design.md` and this
   `.claude/rules/` set encode decisions that override intuition (e.g. *filled brand
   surfaces use `bg/brand/primary/bolder`, not the `#0373DF` ink*). Check them — a
   convention in the doc beats a guess every time.
4. **Lock scope with the human** on any genuine fork (below) before creating anything.

## 1. Everything is tokenised — ZERO hardcoded values, no exceptions

- **Every value binds to a variable. No exceptions.** That means **all** of:
  fill · stroke · stroke-weight · gap · padding · corner-radius · font-size ·
  line-height · letter-spacing · **width · height** · icon size · **container
  max-width** · **breakpoint/frame width** · component height. A hardcoded hex, px,
  or number in a shipped component is a **defect** — not a colour thing, a
  *dimension* thing too (a fixed `height: 46` or `width: 33` is just as wrong as a
  raw hex).
- **If no token fits, add one** (§3) and bind to it — do **not** leave the raw value.
  The AccessibilityBar needed `layout/bar/height` (46), `ref/viewport/*` (frame
  widths), `ref/border-width/hairline` (1px), and `layout/flag/width` (33) — all
  added rather than hardcoded. Even an image's own dimensions get a named token.
- **Prefer HUG/FILL over fixed** where the value is derivable (a bar that hugs its
  padded content needs no height token at all).
- **The only value Figma physically cannot bind is paint opacity** — if a tint needs
  an alpha, prefer a pre-composited colour token; if you must use paint opacity, name
  the node so the audit accounts for it. Nothing else is exempt.
- **Certify it.** The tokenisation audit (§9) MUST return an **empty** hardcoded list
  before the component is done. "Mostly tokenised" is not tokenised.
- **Semantic over primitive.** Bind to the role/semantic layer (`bg/*`, `text/*`,
  `icon/*`, `border/*`, `on/*`, `inline/*`, `stack/*`, `padding/*`, `shape/*`,
  `icon/size/*`, `ref/font/role/*`), not to `ref/*` primitives, unless no semantic
  token exists — in which case **add one** (§3), don't reach past the layer.
- **Use `on/*` pairing** for content on a coloured surface, and honour the contrast
  convention: filled surfaces sit one rung deeper than the same-family ink.
- **Set scopes and WEB code syntax** on every new variable (`var(--…)`); never leave
  `ALL_SCOPES`.

## 2. Nothing external — nested parts come from the library

- **Icons** are the sanctioned system icons — **Material Symbols Rounded** glyphs
  (weight 300 / `Light`), sized via `icon/size/*`. Never hand-draw a vector icon and
  never paste an external SVG.
- **Every nested component** (divider, input, button, chip, avatar …) is an
  **instance of the library component**, not a local re-draw. If the bar needs a
  divider, it instances the `Divider` component.
- **Reused raster assets** (e.g. the National flag) are cloned from the library's
  existing asset, never re-imported from outside.

## 3. If something is missing, add it to the library — and flag it

- Missing token → **create it** in the correct collection, aliased to the right
  primitive, scoped, code-syntaxed. (AccessibilityBar added `icon/size/20`,
  `layout/container/wide|narrow`.)
- Missing nested component → **build it as a proper library component** first, then
  instance it. (AccessibilityBar added the `Divider` component set.)
- **Every addition is reported to the human** in the summary — additions are never
  silent.

## 4. Property model — best practice, not blind copy

- **Variants** encode structural/breakpoint dimensions that change layout
  (`Device`, `Layout`, `Size`). **Boolean / instance-swap / text properties** encode
  independent, composable options (show/hide a control, swap an icon, set a label).
- **Do not** duplicate a boolean as a variant axis (the UX4G bar's redundant
  `Right side options` variant *and* four booleans → we kept only the booleans).
- **Cap variant explosion.** If Device × Layout × State would exceed ~30, push the
  independent axes to properties. Mirror Material/Polaris norms.
- Name variants `Prop=Value, Prop=Value`; give every property a sane default.
- **Property names are designer-friendly, not code identifiers.** Figma properties use
  Title Case with spaces (`Skip to content`, `Font size`, `Accessibility`), like
  Material/Polaris — **never camelCase** (`skipToMainContent`), which reads as code to
  designers. The code component keeps its camelCase props; the two are mapped **via
  Code Connect**, not by being identical strings. Do not claim "Figma ↔ code names 1:1".

## 5. Match the reference visually, and be responsive honestly

- Reproduce the reference's dimensions, spacing, type, and states **exactly**
  (height, gaps, underlines, icon sizes) — differences are brand (colour) only,
  unless a documented decision says otherwise.
- Prefer a **content-container / max-width** mechanism over per-breakpoint hardcoded
  padding when it yields the same visual with less duplication.

## 6. Accessibility is a build gate (WCAG 2.1 AA + GIGW)

- Text/UI contrast ≥ the AA threshold on the actual surface (compute it, don't
  assume). Interactive controls meet the min touch target (`target/*`).
- Every control is keyboard-operable and labelled; focus uses `focus/ring`.
- These are government properties — AA is non-negotiable and blocks "done".

## 7. Flag, document, and let the human decide — never silently resolve

Surface these rather than guessing; collect them into the task summary:

- A property or value that **makes no sense** or is redundant (redundant variants,
  a control that belongs in another component, a counter-intuitive name).
- A **contrast / brand tradeoff** (e.g. brand-key vs a deeper accessible rung).
- Any **deviation** from the reference and **why**.
- Anything **added** to the library.

## 8. Document the component in the SAMAVESH house style — ALWAYS

**Every documentation surface uses the same style and layout as the `Colour` and
`Typography` documentation pages.** Do not invent a per-component layout. Study the
reference (`Colour — Documentation` / `Typography — Documentation`) and match it:

- **One `<Name> — Documentation` frame**, VERTICAL auto-layout, **1680 px wide**,
  fill `bg/neutral/base`, sections stacked flush (gap 0).
- **Hero band** first, fill `bg/brand/primary/base` (pale tint): an **eyebrow**
  (`Label/label-3` in `text/brand/primary/base` + a filled `SAMAVESH` pill), a big
  title in a **Display** style, a lead paragraph in `Body/body-1`, and a white
  **"at a glance"** stats card (numbers in `Display/display-6`, labels `Title/title-3`,
  notes `Body/body-3`). Hero padding: 80 top/bottom, 120 sides.
- **Numbered content sections** ("01 / ANATOMY", "02 / PROPERTIES", …) on
  `bg/neutral/base`, padding 80 top / 120 sides, 40 gap. Each opens with a **header**:
  eyebrow (`Label/label-3`, brand) → title (`Headline/headline-2`) → lead
  (`Body/body-1`, `text/neutral/subtle`).
- **Specimen panels**: light `bg/neutral/subtle` rounded frames (`shape/lg`) holding a
  live component instance and/or white sub-cards (`bg/neutral/base`, `shape/md`) — each
  card an eyebrow label + a `Body/body-2-semibold` value + a `Body/body-3` description.
- **All text bound to published text styles** (`Display/*`, `Headline/*`, `Title/*`,
  `Body/*`, `Label/*`) — never a hand-set size — and **all fills/spacing/radius bound
  to tokens** (§1 applies to docs too; see `.claude/rules/documentation-ds-linkage.md`).
- Section set, in order: **Hero · Anatomy · Properties · Variants · Behaviour ·
  Accessibility · Do & Don't** (add/rename as the component needs, keep them numbered
  and ordered).

Alongside the Figma doc, keep the code doc page under
`apps/hub/src/app/design-system/components/<name>/`, the repo spec under
`docs/design-system/components/<name>.md` (anatomy, token map, flagged decisions), and
the three AI artifacts in lockstep (`design.md`, `AGENTS.md`, `/design-system/llms.txt`)
per `.claude/rules/design-system.md`.

## 9. Validate before claiming done

- `get_screenshot` every variant; visually confirm against the reference.
- Run the **tokenisation audit**: zero unbound fills/strokes/spacing/radius/size,
  all icons are Material Symbols glyphs, all nested parts are library instances.
- Confirm property behaviour (toggle each boolean; switch each variant).
- Only then report done — with evidence, per
  `superpowers:verification-before-completion`.

## 10. Deterministic ordering — never random

Every enumeration is ordered logically (ascending or descending, whichever suits the
context) — **random / insertion order is a defect**:

- **Variant values** by a natural scale: Device `Mobile → Tablet → Desktop → Desktop XL`
  (ascending viewport); Layout `Narrow → Wide → Fluid` (ascending content width);
  Size `sm → md → lg`; numeric by value.
- **Variant rows** in the set are laid out in that same sorted order.
- **Boolean / other properties** in the order they appear in the UI (left→right,
  top→bottom) or alphabetical when there is no spatial order.
- **Token maps, prop tables, value lists** in docs follow the same rule (by role,
  then by scale). Two tables of the same things use the same order.
- **Colour shade rungs** are ordered by **value, lightest → darkest** (ascending
  palette rung): `base → subtler → subtle → bold → bolder → boldest` = rungs
  50 → 100 → 200 → 300 → 600 → 800 (neutral omits `bolder`/`boldest`). **`base` is the
  lightest rung (50), so it comes FIRST** — it is the "quiet" end of the quiet→loud
  ramp on the `Colour` page, not a mid-point. (Its name reads like a default, but its
  value is the palest tint.)
- **Space / radius scales** ascend by value: `none → 2xs → xs → s → m → l → xl …`
  (`inline/s · inline/m · inline/l`, never `m · l · s`).
- **No natural scale?** Alphabetical (the `Accessibility` and `Resources` cards).

The reader should be able to predict where an item is. If you can't state the ordering
principle in one phrase, you haven't ordered it.

## 11. Update in place — never fork the component key

**Edit the existing component; do not create a new one and rename/delete the old.** A
new component gets a **new key**, which silently breaks every instance across the
estate and every Code Connect mapping — the original's identity is what downstream
work is linked to.

- To restructure a component (add a property, rebuild anatomy), mutate the **existing**
  component/set in place so its key and all instance links survive.
- **Need a backup?** Duplicate the original *first* and set the copy aside as the
  archive — then edit the original. Never the reverse (edit a copy, delete the
  original).
- Deprecate-not-delete still applies to genuinely retired components, but that is a
  labelled, deliberate lifecycle step — not a side effect of "rebuilding".
- If you inherit a situation where the key was already forked (as happened once with
  AccessibilityBar), **check for orphaned instances and broken Code Connect first**,
  re-point them to the surviving component, and record it.

## 12. Write the MCP instructions — for EVERY component, no exceptions

**A component is not done until an AI agent that has never seen it can use it
correctly from Figma alone.** Designers read the documentation page; agents read
what the Figma MCP server serves them. Those are different surfaces and both are
part of shipping the component.

Two artifacts, and both are mandatory:

### 12a. The Code Connect template — `<component>.figma.ts`

Lives beside the component (`packages/design-system/components/**/<name>.figma.ts`)
and is picked up by `figma.config.json`. It is a **parserless template**: a
`.figma.ts` file whose default export uses `` figma.code`…` ``.

- **`.figma.ts`, never `.figma.tsx`.** `.figma.tsx` + `figma.connect()` is the
  separate parser-based format and is the wrong artifact here.
- **Account for EVERY Figma property.** Map it, or state in a comment why it is
  omitted — an unmapped property silently emits `undefined`.
- **Map every VARIANT value exhaustively.** A missing enum key is a broken snippet.
- **Never invent a code prop.** If no prop fits, omit and say so.
- **Resolve nested instances dynamically** (`getInstanceSwap` / `findInstance` +
  `executeTemplate()`), never hardcode a child from its layer name.
- Push it with `add_code_connect_map`. **An existing mapping cannot be
  overwritten via the API** — it must be disconnected in the Figma UI first, so
  get the template right before connecting.
- **Keep `*.figma.ts` out of the package tsconfig.** It imports the virtual
  `figma` module that only the Code Connect CLI provides, so
  `packages/design-system/tsconfig.json` excludes `**/*.figma.ts`. Without that,
  `components/**/*.ts` sweeps the template into `npm run typecheck` and it fails
  on an unresolved import — which is exactly what happened the first time.

### 12b. The component description — the agent's briefing

The Figma component's `description` is what the MCP server hands an agent as
context. It is not a tagline. It carries, in this order:

1. One line on what the component is and its anatomy.
2. **The import and source path**, plus "Code Connect is mapped — use the
   generated snippet, do not hand-roll one."
3. **Numbered RULES** — the things an agent would otherwise get wrong: which
   axes are *not* properties (e.g. tone comes from a colour mode, not a variant),
   what a control actually does (opens a widget, not a link), what must never be
   removed (a WCAG affordance), and any duplication to avoid.
4. **TOKENS** — where the component's geometry and colours come from.

Write the rules as *prohibitions and consequences*, not description. "Never add a
tone prop" prevents a defect; "supports theming" prevents nothing.

### Why this is a rule

The AccessibilityBar shipped with a correct Figma master, a correct code
component and a Code Connect mapping — and an agent reading it in Dev Mode would
still have hand-rolled a `tone` prop (tone is a colour *mode*), linked the
accessibility icon to a statement page (it opens the UX4G widget), and dropped
the skip link on mobile (a WCAG 2.4.1 failure). None of that is inferable from
the geometry. It has to be written down where the agent actually looks.

## The one-line version

> Discover first · tokenise everything (zero raw values, dimensions included) · nested
> parts from the library · add what's missing (and say so) · variants for structure and
> properties for options · order everything logically · **update the existing component
> in place, never fork its key** · match the reference visually · pass AA · flag
> anything questionable for the human · document it in the SAMAVESH house doc style
> (Hero + numbered specimen sections, published text styles, like the Colour /
> Typography pages) · **write the MCP instructions — a `.figma.ts` Code Connect
> template and a rules-bearing component description** · validate with a screenshot
> and a zero-unbound audit.
