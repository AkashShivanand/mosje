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

## 2. The six types the API creates — probe the live API, never trust a typings file

`createVariable(name, collection, type)` accepts
`'BOOLEAN' | 'COLOR' | 'FLOAT' | 'STRING' | 'TIMING' | 'EASING'` (probed live on
2026-09-04, apiVersion 1.0.0). The first Motion push was written against the Plugin API
typings bundled with Figma's own `figma-use` skill and read them as listing only the
first four, so it shipped durations as `FLOAT` and curves as `STRING` — 41 variables
that had to be recreated the same day. Re-read on 2026-09-05, that bundle lists all six
and documents `TIMING` and `EASING`; whether it was refreshed in between or misread the
first time cannot be told now, and it does not matter: **a typings file is a claim; a
one-line `createVariable` probe is evidence.** (The same bundle describes a `TIMING`
value as seconds; the probe and the parity record work in milliseconds and read back
correctly — the record is the evidence.)

| Type | Token families | Binds to (scopes) |
|---|---|---|
| `COLOR` | every colour role, ramp, mark, chart slot | `FRAME_FILL` `SHAPE_FILL` `TEXT_FILL` `STROKE_COLOR` `EFFECT_COLOR` (`ALL_FILLS` is the wildcard — never ship it) |
| `FLOAT` | space, size, radius, stroke width, opacity, blur, font size / weight / leading / tracking / paragraph spacing, container, breakpoint, counts (`stagger/max`) | `GAP` `WIDTH_HEIGHT` `CORNER_RADIUS` `STROKE_FLOAT` `EFFECT_FLOAT` `OPACITY` `FONT_SIZE` `FONT_WEIGHT` `LINE_HEIGHT` `LETTER_SPACING` `PARAGRAPH_SPACING` `PARAGRAPH_INDENT` `TEXT_CONTENT` |
| `STRING` | font family, font style NAME | `FONT_FAMILY` `FONT_STYLE` `TEXT_CONTENT` |
| `BOOLEAN` | component options only (`Component Options` collection) — never a token | layer visibility, boolean variant properties |
| **`TIMING`** | every **duration** — `ref/motion/duration/*`, `motion/<intent>/duration`, `loading/spin`, `loading/pulse`, `stagger/step` | Figma Motion binds it by TYPE (animation duration and delay). **Scopes cannot be set** — `variable.scopes = …` throws `Cannot set scopes on this variable type`; a read reports `ALL_SCOPES`, and the payload emits `scopes: []`. The parity checksum skips scopes on these two types for that reason |
| **`EASING`** | every **curve** — `ref/motion/easing/*`, `motion/<intent>/easing` | Figma Motion binds it by TYPE (presets and keyframes). No scopes, as above |

Value shapes the API takes: a `TIMING` value is a number in **milliseconds**
(`setValueForMode(modeId, 150)`); an `EASING` value is
`{ type: "CUSTOM_CUBIC_BEZIER", easingFunctionCubicBezier: { x1, y1, x2, y2 } }`
(Figma also offers named presets and springs — the estate authors its five curves as
DTCG `cubicBezier` arrays, so the custom form is the honest one). Figma stores the
control points as float32 (`0.2` reads back `0.20000000298…`); the parity normaliser
rounds to four decimals on both sides for that reason.

`figmaTypeOf()` in `build/formats/figma-variables.mjs` maps DTCG `duration` → `TIMING`
and `cubicBezier` → `EASING`; a token of either type must never fall through to
`FLOAT`/`STRING` again. `resolvedType` is immutable after creation, so a mistyped
variable cannot be corrected in place — it is renamed under `_legacy/` and hidden
until a binding scan licenses its deletion (§6), and the correct one is created beside
it. That is the one exception to "rename, never recreate", and it exists because the
type IS the identity a designer's motion preset binds to.

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
| **scopes** | the narrowest set that is true (§2). `ALL_SCOPES` and `ALL_FILLS` never — Palette's 138 rungs carried `ALL_FILLS` until 2026-09-05 and now name the five colour scopes. Empty for a hidden `ref/*` primitive (it exists to be aliased, so no picker should offer it) and for values nothing on the canvas can bind (breakpoint), with the reason in the description; TIMING and EASING cannot take a scope at all (§2) |
| **codeSyntax.WEB** | `var(--sa-…)`, the projected CSS name, so Dev Mode shows the line a developer types. ANDROID / iOS are set only when a native platform consumes the token — the estate has none, so they stay unset rather than invented |
| **hiddenFromPublishing** | `true` for every `ref/*` primitive, for the whole **Palette** collection (Tier 1 by role — the brand ramps every Color role aliases — though its names carry no `ref/` prefix), and for every value that only exists to be aliased; `false` for the semantic and component tiers. Judged on the **library name**, never on the source file's tier: `font/role/*` is Tier 1 in the source but publishes as the Tier-2 `type/*` a designer may bind, and the exporter hid all 80 of them by source tier until 2026-09-05 while the library showed them. `isHiddenName()` in `figma-variables.mjs` is the one rule; consumers must see the semantic layer and nothing beneath it |

## 4a. Descriptions come back HTML-encoded — decode before you compare

The Plugin API stores an apostrophe as `&#39;` and an ampersand as `&amp;` and reads them
back that way (probed 2026-09-05: `v.description = "a designer's"` reads back
`a designer&#39;s` in the same script). Figma's own panels render the entities, so a designer
sees the apostrophe; a script that compares raw text does not. Two consequences:

- **Never write an already-encoded string.** A push that copied a read-back description
  produced `&amp;#39;` — visible as literal `&#39;` in the panel — on six variables.
- **Decode before hashing.** The field checksums in `figma-value-parity.mjs` and every
  read-back script decode `&#39; &quot; &gt; &lt; &amp;` (in that order) before comparing a
  description to the payload. A raw read never equals the payload and never will.

## 4b. Five fields, five checksums

The value checksum guards `name|mode|value`. On 2026-09-05 it was equal in every collection
while 479 descriptions, five codeSyntax lines, 138 scope sets and 164 publishing flags had
drifted. `collectionFieldChecksums()` now hashes description, codeSyntax, scopes and hidden per
collection into `reference/figma-live.json` `$fieldChecksums`, with the same
payload / figmaObserved / knownDifference contract as the values — so a push that changes any
field fails the test until the library is read back and re-recorded.

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

- [ ] Type is one of the six the API supports, chosen by §2 — a duration is TIMING, a curve is EASING, never FLOAT/STRING
- [ ] Collection chosen by axis (§3), and it already exists — never a new collection
      without a token-architecture decision
- [ ] `name` equals the DTCG path; `description` non-empty; `scopes` narrowest true
      set; `codeSyntax.WEB` set; `hiddenFromPublishing` by tier
- [ ] Every mode has a value; aliases are `VARIABLE_ALIAS`, same type
- [ ] Upsert by name — existing id kept, value/scopes/description updated in place
- [ ] Read the collection back and re-record `$valueChecksums` in
      `reference/figma-live.json` with the date and the method
