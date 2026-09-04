---
paths:
  - "packages/tokens/**"
  - "tools/figma-*/**"
  - "docs/figma-token-sync/**"
---

# Figma variables — the standard every push follows (MANDATORY)

**Source:** Figma Help, *Overview of variables, collections and modes*
(help.figma.com/hc/en-us/articles/14506821864087), *Create and manage variables*
(15145852043927) and *Modes for variables* (15343816063383), read 2026-09-04, plus
the Plugin API typings (`VariableResolvedDataType`, `VariableScope`,
`CodeSyntaxPlatform`). Standing instruction from the owner the same day: *use every
possibility Figma offers, and keep this knowledge for every design-system task.*
This file is that knowledge. It binds `build/formats/figma-variables.mjs`, every
`use_figma` script that writes a variable, and every audit that reads one.

## 1. What a variable IS, and what it is not

| Figma object | Holds | Can be aliased | Has modes | Use it for |
|---|---|---|---|---|
| **Variable** | one primitive value per mode | yes, by another variable of the same type | yes | every token that is a single value |
| **Style** | a composite (a whole text style, a whole shadow stack) | no — a style cannot be used inside another style or a variable | no | typography roles, elevation stacks, focus rings |

So: a token that is ONE value (a colour, a length, a duration, a name) is a variable.
A token that is a BUNDLE (a shadow with three layers, a type role with size + leading
+ weight) is a style whose parts bind variables. `elevation/*` is a style; the `ref/*`
numbers inside its layers are variables. `Body/body-1` is a style; `type/body/1/size`
is a variable it binds.

## 2. The four types the API can create, and the two it cannot

`VariableResolvedDataType = 'BOOLEAN' | 'COLOR' | 'FLOAT' | 'STRING'`.

| Type | Token families | Binds to (scopes) |
|---|---|---|
| `COLOR` | every colour role, ramp, mark, chart slot | `FRAME_FILL` `SHAPE_FILL` `TEXT_FILL` `STROKE_COLOR` `EFFECT_COLOR` (`ALL_FILLS` is the wildcard — never ship it) |
| `FLOAT` | space, size, radius, stroke width, opacity, blur, font size / weight / leading / tracking / paragraph spacing, container, breakpoint, **duration (ms)**, z | `GAP` `WIDTH_HEIGHT` `CORNER_RADIUS` `STROKE_FLOAT` `EFFECT_FLOAT` `OPACITY` `FONT_SIZE` `FONT_WEIGHT` `LINE_HEIGHT` `LETTER_SPACING` `PARAGRAPH_SPACING` `PARAGRAPH_INDENT` `TEXT_CONTENT` |
| `STRING` | font family, font style NAME, **easing curve** (a `cubic-bezier()` string) | `FONT_FAMILY` `FONT_STYLE` `TEXT_CONTENT` |
| `BOOLEAN` | component options only (`Component Options` collection) — never a token | layer visibility, boolean variant properties |

Figma also documents **Timing** (ms) and **Easing** (curve or spring) variable types.
They exist only for Figma Motion presets and **the Plugin API cannot create them**
(`createVariable` accepts the four types above). Until it can, a duration ships as a
`FLOAT` in milliseconds and an easing as a `STRING`, both with **empty scopes** and a
description saying why: nothing on a static canvas binds them, and offering them in
a Gap or Width picker would be a lie. Re-check this table when the API version
changes; the gate that reads it is `figma-export.test.mjs`.

A number variable is also the **opacity of a colour variable** — that is what
`alpha/*` carries `COLOR_OPACITY` for, and why every translucent colour token is a
colour reference PLUS an `{alpha.N}` reference rather than a baked hex8.

## 3. Collections and modes

- One collection holds up to **5,000 variables**. Group inside it with `/`; the
  group tree in the panel IS the token path, which is why RULE 1 forbids a hyphen
  inside a segment.
- A **mode** is one column of values. Modes are for values that genuinely change
  together on one axis — brand, density, surface × breakpoint, viewport — and never
  for values that merely differ. A collection with modes forces every variable in it
  to carry every column, so a mode is added to the collection whose variables ALL
  vary on that axis, and to no other. That is why `Viewport` holds two variables and
  `Space` holds none of them.
- **Mode limits are per plan** (Starter 1 · Professional 4 · Organization 4 ·
  Enterprise 40; `addMode` throws `Limited to N modes only` at the ceiling). The
  SAMAVESH library's `Type` collection carries six modes, which is the empirical
  ceiling this file lives under — do not design a seventh without checking.
- A node's mode is **Auto** by default and inherits from its nearest ancestor with an
  explicit mode; the collection's default mode is the fallback. So the first mode in
  a collection is the one every unset frame renders — it must be the conformant one
  (`ds-documentation-standard.md` §6 says the same about variants).
- `variableCollectionId` is **get-only**: a variable can never move between
  collections. Decide the collection before the first push; a wrong home is
  permanent short of delete-and-recreate, which orphans every binding.

## 4. Every variable carries all five of these, or the push is refused

| Field | Rule |
|---|---|
| **name** | the DTCG path joined with `/`, tier-prefixed for `ref` and `cmp` only (`grammar.mjs`) |
| **description** | the `$description` from source, or the sentence `usage-guidance.mjs` derives — never empty. `figma-variables.mjs` writes an empty description when guidance is silent; that is a bug to fix in the guidance module, not in Figma |
| **scopes** | the narrowest set that is true (§2). `ALL_SCOPES` never. Empty ONLY for values nothing on the canvas can bind (duration, easing, breakpoint), with the reason in the description |
| **codeSyntax.WEB** | `var(--sa-…)`, the projected CSS name, so Dev Mode shows the line a developer types. ANDROID / iOS are set only when a native platform consumes the token — the estate has none, so they stay unset rather than invented |
| **hiddenFromPublishing** | `true` for every `ref/*` primitive and every value that only exists to be aliased; `false` for the semantic and component tiers. Consumers must see the semantic layer and nothing beneath it |

## 5. Aliasing

- An alias is a reference to a variable **of the same type**. Tier 2 aliases Tier 1
  by construction; Tier 3 aliases Tier 2. Never write a resolved literal where the
  source has a reference — `figma-roundtrip.test.mjs` fails on a leaked `{…}` and on
  a broken alias edge.
- Cross-collection aliases are allowed and expected (Color → Palette carries the
  brand axis without Color having modes). That is the mechanism; it is not a
  workaround.
- Rename, never recreate. A rename preserves the variable id and every binding; a
  delete-and-create orphans every node that pointed at it (the `Font Size/3` ghost
  is bound on 2,876 properties for exactly this reason).

## 6. Delete only with evidence

Deleting a variable does not warn about consumers, and a published library cannot
enumerate them. Before a delete: scan every page for `boundVariables`, styles for
their bindings, and every other variable for aliases (`figma-ghost-audit.mjs` is the
walker). Record the scan in `reference/figma-live.json` with the count. Zero
consumers is the only licence.

## 7. Checklist for any script that writes a variable

- [ ] Type is one of the four the API supports, chosen by §2
- [ ] Collection chosen by axis (§3), and it already exists — never a new collection
      without a token-architecture decision
- [ ] `name` equals the DTCG path; `description` non-empty; `scopes` narrowest true
      set; `codeSyntax.WEB` set; `hiddenFromPublishing` by tier
- [ ] Every mode has a value; aliases are `VARIABLE_ALIAS`, same type
- [ ] Upsert by name — existing id kept, value/scopes/description updated in place
- [ ] Read the collection back and re-record `$valueChecksums` in
      `reference/figma-live.json` with the date and the method
