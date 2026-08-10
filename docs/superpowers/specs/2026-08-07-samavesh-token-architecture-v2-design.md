# SAMAVESH Token Architecture v2 — a best-in-class token system, code and Figma in lockstep

- **Status:** Draft for review — revised twice (LLM Council audit, then grammar v3), 2026-08-07
- **Date:** 2026-08-07
- **Owner:** `packages/tokens`, `packages/design-system`
- **Supersedes:** the `--ds-*` semantic layer (retained as generated aliases while call sites exist)

> **Revision history.**
> **v1** proposed adopting UX4G's `--ux4g-*` prefix as SAMAVESH's own application-facing API.
> An LLM Council audit rejected it and a measurement confirmed the audit (§2.1).
> **v2** replaced it with `--sa-{ref,sys,cmp}-*`.
> **v3 (this document)** makes the token's identity a **path** rather than a string, and fixes
> three defects v2 still carried (§3).
>
> *Corrected 2026-08-07:* v3 originally claimed this enables a **bidirectional** Figma sync.
> It does not. The pipeline is code → Figma only; there is no import path, and
> `figma-roundtrip.test.mjs` validates the payload against itself and a snapshot of the live
> library, not a live read-back. Code-authoritative one-way sync is a deliberate and common
> choice — but it should not be described as round-tripping.
>
> **The goal is not UX4G conformance.** It is the best token system we can build. UX4G
> conformance is a by-product, discharged by a generated artifact (§8).

---

## 1. Decision

1. A token's canonical identity is a **path** — the same tree in DTCG source and in Figma.
   The CSS custom property is a deterministic projection of that path.
2. **One application-facing prefix**, `--sa-*`, with the most-used tier carrying no marker.
3. **Prominence is a contract, not an adjective** — every rung guarantees a contrast class,
   enforced in CI (§6.3).
   > *Corrected 2026-08-07:* this previously read "no comparable system does this", which is
   > wrong. Material 3's `on-*` roles carry the same guarantee by construction, USWDS grades
   > are designed so contrast is predictable from the name, and Spectrum publishes contrast
   > per token. What is distinctive here is **enforcing it in CI** — not the idea.
4. UX4G's published contract is emitted as a **100 % generated compatibility layer plus a
   machine-diffable conformance report** (§8) — conformance is a proof obligation, not an API.

---

## 2. What the audit changed

### 2.1 The measurement that reversed v1

v1 claimed UX4G's grammar was more regular than ours. Nobody had checked.

> **Correction, 2026-08-07.** The first reporting of this said "52 % of UX4G's colour tokens
> fail to parse". **That figure was not sound.** It came from attempting a full parse, and the
> rate moved between **41 %, 52 % and 62 %** depending only on which prominence words the
> parser happened to accept — it was measuring our dictionary choices as much as UX4G's
> consistency. It has been replaced with a measurement that cannot be tuned.

The durable measurement counts violations of the *shape* of a name, independent of any
vocabulary. `node build/grammar.mjs --audit-reference`, gated by
`test/naming-grammar.test.mjs`:

```
colour-role tokens in scope:   146
STRUCTURAL violations:          23   (16 %)
  roleHyphenated  21   `border-color-*` alongside `border-*` — the same role spelled two
                       ways, one with a hyphen INSIDE the slot value
  rawHueFamily     1   `bg-yellow-strong` — a Tier-1 primitive leaking into the semantic tier
  roleAsFamily     1   `bg-overlay` — `overlay` used as a family, though it is a role elsewhere
```

Each is checkable by eye against the published contract, and none can be argued away by
choosing different dictionaries.

**The conclusion is unchanged; its strength is not.** UX4G's published contract is not a
consistent grammar one can adopt wholesale — 23 tokens contradict the pattern the other 123
imply, and the dominant class (a hyphen inside a slot value) is precisely what makes a flat
name unparseable. But this is "a real, systematic defect in a minority of tokens", **not**
"more than half the system is broken". §5.2's RULE 1 makes the dominant class structurally
impossible here.

### 2.2 Name–value divergence

Using UX4G's names with different resolved values defeats the compatibility they were meant to
buy: `--ux4g-bg-brand-subtle` rendering gov-blue means a pasted UX4G snippet produces the wrong
colour **silently**. Since UX4G's distribution cannot be installed at all (§8.3), paste
compatibility was never available.

### 2.3 Changes carried from the council

| # | Change | Source |
|---|---|---|
| 1 | One app-facing prefix; `--ux4g-*` fully generated | First Principles, Contrarian |
| 2 | Kill the `--ux4g-sa-*` extension namespace — a symptom of renting a namespace | 4 of 5 advisors |
| 3 | Fix the prominence ladder — the native layer is not bound by parity | First Principles |
| 4 | Rename the misleading colour-mode axis (§4.2) | First Principles, Outsider |
| 5 | Grammar must be generative, validated, and cover non-colour tokens | Outsider |
| 6 | Vertical slice first (Button end-to-end), not a horizontal rollout | Executor |
| 7 | Generate the deprecation map from real call sites; delete what has none | Executor |
| 8 | Tier 3's ~130 tokens are generated from a matrix, never hand-typed | Executor |

### 2.4 Recorded risks

| # | Risk | Status |
|---|---|---|
| R1 | Figma cannot model four orthogonal runtime axes in one collection | **Solved** — one axis per collection (§8.4), subject to confirming the workspace's per-collection mode limit |
| R2 | The axis cross-product is a contrast hazard if tests check axes independently | Mitigated — §9.3 enumerates the actual product |
| R3 | Almost no app code types raw custom properties; the real API is Tailwind utilities, DS props and LLM-authored markup | Mitigated — `dist/manifest.json` is a first-class output (§9.6) |
| R4 | One shared Tailwind build in `apps/hub` with per-portal values under `[data-portal]` — a rename ripples everywhere at once | Open — §10.3 requires owner, freeze window, rollback before Phase 3 |
| R5 | The Figma round-trip is hand-done and is the true schedule risk | Mitigated — §8.4 makes it mechanical; §12 Phase 1 proves it on one component |
| R6 | Nobody has asked the UX4G team anything | Open — §11.1 |

### 2.5 The sync finding

`dist/figma.tokens.json` as generated today is **11 KB, 11 top-level groups, no `$type`, no
`$value`, no aliases, no modes, no collections** — a one-way flat value snapshot of a subset
(`color.action.primary.default = "#0373df"`, `spacing.lg = "16px"`). Names may match, but they
match **by discipline, not by the pipeline**. §8.4 replaces this exporter; without it, "100 %
Figma sync" is an aspiration rather than a property of the system.

---

## 3. Why v3, and what it fixes in v2

v2 was better than v1 on every axis. Judged as *best-in-industry with code↔Figma sync*, it
carried three defects:

| Defect | v2 | v3 fix |
|---|---|---|
| **D1 — ambiguous delimiter** | `--sa-sys-border-width-md`, `--sa-sys-bg-neutral-inverse-subtle`, `--sa-sys-z-modal-backdrop` all contain hyphens *inside* slot values. This is precisely the defect behind 21 of UX4G's 23 structural violations (§2.1). | The **path** is canonical and **no segment may contain a hyphen** (§5.2). Multi-word concepts become extra depth: `border/width/md`. Same CSS string, unambiguous source. |
| **D2 — tier marker justified by the wrong reason** | `sys` was justified on lintability, which a manifest gives you for free. It costs four characters on the 90 %-case token, and every comparable system keeps the tier out of the consumed name. | Marker-by-exception (§4.1): Tier 2 has none, so the most-typed token is shortest — while staying **bijective**, because `ref`/`cmp` are reserved as Tier-2 first segments. |
| **D3 — the ladder predicts nothing** | `subtlest…boldest` says how loud a colour is, not what you may do with it. On a system with a legal AA obligation, permission is the more valuable property. | Every rung **guarantees a contrast class**, published in the manifest and the Figma variable description, enforced in CI (§6.3). |

### 3.1 Scored

| Criterion | v1 | v2 | v3 |
|---|:--:|:--:|:--:|
| Parses its own examples | ✗ (23 structural violations) | ✓ | ✓ |
| Generative without lookup | ✗ | ✓ | ✓ |
| No ambiguous delimiter | ✗ | ✗ | ✓ |
| Bijective Figma round-trip | ✗ | partial | ✓ |
| Shortest name for the 90 % case | ✓ | ✗ | ✓ |
| Predicts accessibility behaviour | ✗ | ✗ | ✓ |
| Covers non-colour tokens | ✗ | ✓ | ✓ |
| Survives upstream UX4G changes | ✗ | ✓ | ✓ |
| Tier misuse lintable | ✗ | ✓ | ✓ |

---

## 4. Tier model

```
LAYER −1  BRAND PACK       brands/<id>/brand.json      build-time only, never emitted
                           └─ identity primitives; PATHS fixed, VALUES swappable
                              BRAND=<id> npm run build -w @mosje/tokens

TIER 1    REFERENCE        --sa-ref-*                  palette + raw scales · BANNED in app code
TIER 2    SYSTEM           --sa-*                      the API · ~90 % of usage
TIER 3    COMPONENT        --sa-cmp-*                  generated from a matrix

COMPAT    --ux4g-*         generated alias sheet + conformance report · nobody authors against it
COMPAT    --ds-*           generated alias sheet, shrinking as call sites migrate
```

### 4.1 Tier ↔ Figma collection ↔ CSS marker

| Tier | Figma collection | CSS marker | Example |
|---|---|---|---|
| 1 Reference | `1 · Reference` | `ref` | `--sa-ref-color-blue-500` |
| 2 System | `2 · Color` / `2 · Type` / `2 · Space` / `2 · Static` | *(none)* | `--sa-bg-brand-primary-bold` |
| 3 Component | `3 · Component` | `cmp` | `--sa-cmp-action-brand-primary-hover-bg` |

Bijective because `ref` and `cmp` are **reserved words, banned as a Tier-2 first path segment**
(§9.1). Absence of a marker therefore means Tier 2, unambiguously.

### 4.2 Runtime dimensions — and the axis rename

Four orthogonal axes, applied as HTML attributes on **any** element, not only `<html>`:

| Attribute | Values | Meaning |
|---|---|---|
| `data-brand` | `blue` · `navy` · `ux4g` · `ux4gdeep` | **Brand palette.** Renamed from `data-color-mode`; old attribute and ids kept as deprecated aliases. |
| `data-theme` | `light` · `dark` · `hc` | Appearance: light, dark, high-contrast. |
| `data-density` | `comfortable` · `compact` | Control heights and padding. |
| `data-surface` | `website` · `portal` | Type scale only. |

> **Why the rename is required.** The old values were `blue-light` and `blue-dark`. **These were
> never light and dark themes.** They are two brand palettes built on two different blues:
>
> | Old value | Primary | Secondary | Neutrals |
> |---|---|---|---|
> | `blue-light` | gov-blue `#0373df` | saffron `#f97316` | warm grey |
> | `blue-dark` | gov-navy `#003366` | green `#198754` | cool grey |
>
> Both render on **light surfaces**. The words `light`/`dark` collided head-on with
> `data-theme`, which *is* appearance — a developer reading `data-color-mode="blue-dark"` had
> every reason to expect a dark UI and got a navy one. The values are renamed to what they are:
> **`blue`** and **`navy`**. `ux4g` is the third brand (violet), used to demonstrate conformance
> by flipping one attribute.
>
> `data-color-mode` and its old values are kept as deprecated read-aliases for one minor version,
> then removed by codemod.

---

## 5. The grammar (v3)

### 5.1 Path is canonical; CSS is a projection

```
Figma    Collection "2 · Color"  →  bg / brand / primary / bold      [modes: brand × theme]
DTCG     { bg: { brand: { primary: { bold: { $type, $value } } } } }
CSS      --sa-bg-brand-primary-bold
```

Grammar rules constrain **the path**, not the string. The CSS name never has to be parseable by
a consumer — tools read `dist/manifest.json` (§9.6). This is how Atlassian, Polaris and Carbon
work, and it is what makes the Figma tree and the DTCG tree literally the same tree.

### 5.1a Corrections found while implementing (2026-08-07)

Four grammar changes, each forced by something the implementation surfaced. All are gated by
`test/naming-grammar.test.mjs`.

| # | Change | Why |
|---|---|---|
| 1 | **The canonical value takes an explicit segment** — `text/neutral/base`, not `text/neutral`. Spelled `default` until 2026-08-10; see §5.1c | DTCG and Figma are both **trees**, and a token cannot also be a group. `text/neutral` as a leaf silently swallowed `text/neutral/subtle`, and Style Dictionary dropped every child. "Omitted prominence = canonical" is unimplementable on a tree. |
| 2 | **Link variant `default` → `brand`** *(landed 2026-08-10, §5.1c)* | With (1), the canonical link would be `text/link/default/default`. The standard link *is* the brand-coloured one, so name it that: `text/link/brand/default`. |
| 3 | **`focus` is a GROUP, not a role + state** | A focus ring is not "an outline in the focus state" — it has its own colour, width and offset, and WCAG 2.4.7 makes it non-optional. `outline/focus` did not parse; `focus/ring` does. UX4G models it the same way. |
| 4 | **RULE 1 bans a delimiter inside a segment, not uppercase** | The first regex (`^[a-z0-9]+$`) also banned camelCase and flagged 224 legacy segments. camelCase splits unambiguously (`--sa-ref-color-secondaryRamp-light-50`); a hyphen does not. Lowercase remains house style for newly-authored namespaces, enforced separately. |

One genuine RULE 1 violation *was* found in the foundation and fixed: `font/role/display-1/size`
became `font/role/display/1/size`. The emitted name is unchanged (`--ds-type-display-1-size`) —
the family and number rejoin in `buildResponsiveType`, which is now the only place that mapping
lives.

### 5.1b The Tier-2 migration is additive

The pre-grammar semantic tier is not role-based: `--ds-primary` is used today as a background,
a text colour **and** a border colour, so there is no single correct role to rename it to. A
mechanical rename would mean guessing roles across 21 production properties.

So `src/system.generated.json` adds the canonical namespace as pure `{references}` to existing
tokens — 111 tokens, provably identical values — and the 245 legacy paths stay on an explicit
allowlist in `test/naming-grammar.test.mjs` that may only shrink.

`test/tier2-parity.test.mjs` proves the two agree **in every axis block**, not just `:root`.
That matters because Style Dictionary resolves references to literals by default: a literal
would pass at `:root` and then freeze, silently ignoring `[data-theme]`. The canonical
namespace is therefore emitted as `var()` chains and re-asserted in every block that
redeclares a target.

### 5.1c One word, one slot (2026-08-10)

`default` occupied **three** slot dictionaries at once — prominence, state, and the link
variant. The parser fills slots greedily and positionally, so it bound `default` to the first
dictionary that claimed it and never reached the others. `text/link/visited/default` parsed as
`{variant: visited, prominence: default}`, silently discarding the state it was spelling. No
error was raised; the token simply meant something other than it read.

Two renames, no third:

| Slot | Was | Is | Resulting names |
|---|---|---|---|
| Prominence canonical | `default` | **`base`** | `bg/neutral/base`, `text/brand/primary/base` |
| Link variant | `default` | **`brand`** | `text/link/brand/default`, `text/link/brand/hover` |
| State canonical | `default` | unchanged | `text/link/visited/default` — now genuinely a state |

This was a rename, not a redesign. `test/visual-contract.test.mjs` resolves every `var()` chain
in `dist/tokens.css` to a literal, per selector context, and pins it: all 27 moved names resolve
byte-identically before and after, in all 7 contexts, and nothing else moved. The `--ds-*` compat
layer and the `--ux4g-*` parity layer keep their names — the former was retargeted at the new
canonical names, the latter never referenced them (§8.1a).

**The invariant is now enforced.** `test/slot-disjointness.test.mjs` fails the build if any word
becomes reachable in two slots of the same path. It is scoped to what the parser actually does:
`bg` being both a Tier-2 `role` and a Tier-3 `property` is not ambiguity, because no single
position consults both.

**Two ambiguities survive, pinned rather than fixed:**

| Words | Slots | Reading the parser picks |
|---|---|---|
| `primary` `secondary` `tertiary` | `variant` (brand) vs ink prominence | the brand variant; the ink-prominence reading is unreachable for `family=brand` |
| `visited` | `variant` (link) vs `state` | the visited-link *family*; "canonical link, visited state" is spelled `text/link/brand/visited` |

Both are the same class of defect as `default` was, resolved by greedy order rather than by the
grammar being unambiguous. They are listed instead of fixed because fixing them renames shipped
tokens, which is its own change with its own visual-contract review. The guard's stale-entry test
forces the list to shrink when they are.

### 5.2 The rule that fixes D1

> **No path segment may contain a hyphen.** Hyphens exist only as the flattening delimiter.

| Concept | Path | CSS |
|---|---|---|
| border width, medium | `border/width/md` | `--sa-border-width-md` |
| inverse subtle neutral bg | `bg/neutral/inverse/subtle` | `--sa-bg-neutral-inverse-subtle` |
| modal backdrop z-index | `z/modal/backdrop` | `--sa-z-modal-backdrop` |
| chart tooltip background | `chart/tooltip/bg` | `--sa-chart-tooltip-bg` |
| chart empty region | `chart/region/empty` | `--sa-chart-region-empty` |

Identical CSS strings to v2, unambiguous source, and a properly navigable Figma tree instead of
a flat list of long names.

### 5.3 Shapes

```
Tier 1   <category>/<...>                                       color/blue/500 · space/16
Tier 2   <role>/<family>[/<variant>][/<prominence>][/<state>]   colour roles
         <group>/<...>                                          non-colour
Tier 3   <component>/<intent>/<variant>/<state>/<property>
```

### 5.4 Slot dictionaries (closed; validated in CI)

| Slot | Required | Values |
|---|---|---|
| `role` | ✅ | `bg` · `text` · `icon` · `border` · `outline` · `shadow` · `overlay` |
| `family` | ✅ | `neutral` · `brand` · `status` · `link` |
| `variant` | conditional | brand → `primary` `secondary` `tertiary` · status → `success` `error` `warning` `info` · link → `brand` `neutral` `visited` |
| `prominence` | ❌ | fill ladder `base` `soft` `subtle` `emphasis` `strong` `stronger` · ink ladder `primary` `secondary` `tertiary` `strong` — **the canonical value is `base`, named explicitly (§5.1a #1)** |
| `state` | ❌ | `default` `hover` `active` `focus` `visited` `selected` `disabled` — `default` is the canonical state and, since 2026-08-10, its **only** meaning anywhere in the grammar (§5.1c) |
| `group` | — | `space` `inline` `stack` `padding` `section` `radius` `opacity` `z` `border` `elevation` `motion` `type` `density` `chart` `on` `layer` |

Optional prominence with a canonical fallback is what lets the grammar cover the cases UX4G
handled by exception (`bg/overlay`, `bg/neutral/disabled`) without special-casing.

**Reserved:** `ref`, `cmp` may not begin a Tier-2 path.

### 5.5 Worked examples — all parse

| CSS | Path | Reading |
|---|---|---|
| `--sa-bg-brand-primary` | `bg/brand/primary` | canonical brand background |
| `--sa-bg-brand-primary-bold-hover` | `bg/brand/primary/bold/hover` | + prominence + state |
| `--sa-text-neutral` | `text/neutral` | canonical ink |
| `--sa-text-neutral-subtle` | `text/neutral/subtle` | secondary ink |
| `--sa-text-link-visited-hover` | `text/link/visited/hover` | visited link, hovered |
| `--sa-icon-status-error` | `icon/status/error` | error icon |
| `--sa-z-modal-backdrop` | `z/modal/backdrop` | non-colour group |
| `--sa-cmp-action-brand-primary-hover-bg` | `action/brand/primary/hover/bg` | Tier 3 |

---

## 6. Prominence — an ordinal ladder with a contrast contract

### 6.1 The defect being fixed

UX4G's ladder is not monotonic in the way its names imply. From `Background/Brand/Primary`:

| UX4G name | Value | Ramp step |
|---|---|---|
| `default` | `#f2efff` | 50 — **lightest** |
| `soft` | `#dcd4ff` | 100 |
| `subtle` | `#c0b3ff` | 200 — *darker than* `soft` |
| `emphasis` | `#a391ff` | 300 |
| `strong` | `#4a2bc2` | 600 |
| `stronger` | `#301c7d` | 800 |

`subtle` louder than `soft`, `default` quietest of all. v1 proposed enshrining this. The native
layer is not bound by parity, so it is fixed here; the compatibility layer preserves UX4G's
inverted names verbatim (§8.1), so nothing is lost.

### 6.2 The ladder

Six strictly-ordinal rungs, quietest → loudest, with **no ambiguous `default` rung** — the
canonical value is the token with *no* prominence segment.

```
subtlest · subtler · subtle · bold · bolder · boldest
```

| SAMAVESH | UX4G equivalent | brand-primary bg |
|---|---|---|
| `subtlest` | `default` | ramp 50 |
| `subtler` | `soft` | ramp 100 |
| `subtle` | `subtle` | ramp 200 |
| `bold` | `emphasis` | ramp 300 |
| `bolder` | `strong` | ramp 600 |
| `boldest` | `stronger` | ramp 800 |

### 6.3 Each rung guarantees a contrast class — the differentiator

Published in `dist/manifest.json`, written into every Figma variable description, and
**enforced** by §9.2:

| Rung | Guaranteed contrast vs its surface | Permitted use |
|---|---|---|
| `subtlest` | < 3:1 | decorative fills only |
| `subtler` | < 3:1 | decorative fills only |
| `subtle` | ≥ 3:1 | UI boundaries, icons, non-text (WCAG 1.4.11) |
| `bold` | ≥ 3:1 | UI boundaries, icons, non-text |
| `bolder` | ≥ 4.5:1 | **text-safe** (WCAG 1.4.3 AA) |
| `boldest` | ≥ 7:1 | text-safe (AAA) |

The name now states what you are *permitted* to do, not merely how loud it looks. A developer —
or an LLM — reaching for `--sa-text-neutral-subtler` as body copy fails CI with a reason.
Atlassian's ladder is aesthetic; USWDS's grades are predictive but not contractual. **Neither is
enforced.** This is the single most valuable property in the system and it maps directly onto
the GIGW / WCAG 2.1 AA obligation.

### 6.4 It dissolves the `primary` overload

UX4G uses `primary`/`secondary`/`tertiary` as *ink prominence* while also using `primary` for
the brand colour, disambiguated only by an adjacent slot. Under an ordinal ladder the collision
cannot occur:

| Meaning | UX4G | SAMAVESH |
|---|---|---|
| Most prominent ink | `--ux4g-text-neutral-primary` | `--sa-text-neutral` |
| Secondary ink | `--ux4g-text-neutral-secondary` | `--sa-text-neutral-subtle` |
| Tertiary ink | `--ux4g-text-neutral-tertiary` | `--sa-text-neutral-subtler` |
| The brand colour | `--ux4g-text-brand-primary` | `--sa-text-brand-primary` |

> **Correction (2026-08-10).** This section describes the intended design, not the shipped one.
> The implemented ink ladder kept UX4G's `primary`/`secondary`/`tertiary` rather than mapping
> onto `subtle`/`subtler`, so the overload is **not** dissolved: those three words still sit in
> both the brand `variant` slot and the ink prominence slot. The collision is resolved by the
> parser's greedy order, not by the grammar. It is pinned in §5.1c and gated by
> `test/slot-disjointness.test.mjs`. Either finish the ladder migration or accept the overload
> deliberately — but the spec should not claim it cannot occur while it does.

---

## 7. Token inventory

### 7.1 Tier 1 — Reference (`--sa-ref-*`)

Adopt UX4G's breadth: **15 hue families × 11 steps (50–950)**, up from 7 × 10.

```
color/<hue>/<step>          hue ∈ primary secondary tertiary neutral red orange yellow gold
                                  lime green cyan skyblue blue purple pink
                            step ∈ 50 100 200 300 400 500 600 700 800 900 950
color/neutral/0             white          color/neutral/1000   black
color/<hue>/<step>/a        25 % alpha     color/neutral/<step>/b   70 % alpha
```

Retained from SAMAVESH: the 8/16/24/32/40/48 % transparent tiers (finer than UX4G's two),
`space` (`none…11xl`), `radius` (`none…full`), `font/role/*` (21 roles), `font/tracking/*`,
`motion/*`.

**Added** (UX4G has, SAMAVESH lacks):
```
border/width/{none,sm,md,lg,xl}
opacity/{0,10,20,25,…,100}
z/{dropdown,sticky,fixed,modal/backdrop,modal,popover,offcanvas,toast}
elevation/{0..4}/{key,ambient}/{x,y,blur,spread,color}
```

### 7.2 Tier 2 — System (`--sa-*`)

```
bg      neutral                              [canon] subtlest subtler subtle bold bolder boldest
                                             + elevated inverse inverse/subtle translucent none disabled
        brand/{primary,secondary,tertiary}   [canon] + full ladder
        status/{success,error,warning,info}  [canon] + subtlest…bolder
        overlay                              [canon] bolder

text    neutral                              [canon] subtle subtler disabled inverse
        brand/{primary,secondary,tertiary}   [canon] disabled
        status/{success,error,warning,info}  [canon]
        link/{default,neutral,visited}       [canon] hover active disabled inverse     [15]

icon    neutral                              [canon] subtle subtler disabled inverse
        brand/{primary,secondary,tertiary}   [canon] disabled
        status/{success,error,warning,info}  [canon]

border  neutral                              subtle [canon] bolder focus
        brand/{primary,secondary,tertiary}   [canon] bolder
        status/{success,error,warning,info}  [canon] bolder

outline focus                                [canon] inverse
```

Non-colour groups: `space` · `inline` · `stack` · `padding` · `section` · `radius` ·
`border/width` · `opacity` · `z` · `elevation` · `motion` · `density`.

**SAMAVESH capability UX4G has no equivalent for — now plain `--sa-*`, no special namespace:**

| Group | Tokens | Why it beats UX4G |
|---|---|---|
| `on/*` | `on/bg/<family>/<variant>/<prominence>` | Material 3's `on-` pairing. Every background carries a guaranteed-AA foreground, asserted in CI. Neither system has this. |
| `layer/{0..3}` | + `layer/border/{0..3}` | Carbon's nestable surfaces — card-in-card-in-page resolves automatically. |
| `chart/*` | 120 tokens: `cat/{1..12}`, `seq/{50..900}`, `div/*`, `trend/*`, `grid`, `axis`, `tooltip/*`, `region/*` | UX4G defines **none** (§11.4). |
| `type/*` | 21 roles × `{size,lh,para,tracking}`, fluid `clamp()`, surface as a **mode** not a segment | UX4G is fixed-size, one surface, no paragraph spacing. |
| `type/<role>/weight/{default,strong}` | emphasis as a token | Adopts UX4G Figma's best typography idea, which its own CSS never shipped. |
| `font/devanagari`, `leading/devanagari` | bilingual | UX4G has none. |
| `density/*` | control heights, paddings | UX4G has none. |

### 7.3 Tier 3 — Component (`--sa-cmp-*`), generated

```
action   {brand, destructive, neutral}
       × {primary, secondary, tertiary, tonal}    (neutral: secondary, tertiary only)
       × {default, hover, active, disabled}
       × {bg, text, border}                                     ≈ 108

control  bg        default hover active disabled selected error
         border    default hover error disabled
         indicator on off disabled
         track     on off disabled
         thumb     default hover active disabled

spinner  {brand, light, destructive} × {1, 2}
```

Produced by `build/generate-component-tokens.mjs` from a matrix JSON. **A human never types
these names**; drift is impossible by construction.

---

## 8. Conformance and Figma sync

### 8.1 The UX4G compatibility stylesheet

`@mosje/design-system/ux4g.css` — all 755 published `--ux4g-*` names, each a pure alias onto a
`--sa-*` token. Opt-in; the default bundle does not grow. Generated by
`build/formats/ux4g-compat.mjs` from one mapping table.

| Kind | Rule | Example |
|---|---|---|
| **Structure** (space, radius, type size, weight, border, opacity, z) | UX4G's **exact value**, bound to the same number so they cannot drift | `--ux4g-stack-m` → `--sa-ref-space-lg` → `16px` |
| **Colour** | Maps by **role**, to the MoSJE palette | `--ux4g-bg-primary-strong` → gov-blue, **not** UX4G violet |

### 8.1a What a `--ux4g-*` alias promises — and what it does not

**An alias preserves UX4G's VALUE, not our rung.** `--ux4g-bg-primary-subtle` emits UX4G's ramp
step 200. That is *not* what `subtle` means in our ladder, and the two must not be conflated.

The consequence, stated plainly so nobody has to rediscover it:

> **`--ux4g-*` names sit OUTSIDE the SAMAVESH contrast contract (§6.3).** The prominence ladder
> test does not check them, and it does not check them **by construction, not by exception** —
> the ladder is a property of `--sa-*` rungs, and a `--ux4g-*` name is not a rung. There is no
> allowlist to keep in sync and no suppression to review, because there is nothing to suppress.

**Why value, not rung.** A developer pasting UX4G markup into a MoSJE page must get UX4G's
rendering. If our aliases quietly re-pointed UX4G's names at our ladder, that markup would render
differently here than in the reference system, with nothing in the code to explain it. Silently
changing what a borrowed name renders is the worse failure — worse than the honest inconsistency
of two vocabularies coexisting, each meaning what it says.

Two vocabularies, two namespaces, no overlap:

| Namespace | Owns | Contrast contract | Renamed by §5.1c? |
|---|---|---|---|
| `--sa-*` | SAMAVESH | ✅ §6.3 rungs | yes — 27 names |
| `--ux4g-*` | UX4G 3.0 | ❌ outside it, by construction | **no** — resolves inside its own namespace from UX4G's reference contract, so our renames cannot reach it |

This is also why §5.1c could rename `text/link/default` to `text/link/brand` without touching
`--ux4g-text-link-default-default`: that name is UX4G's spelling of UX4G's value, and a developer
grepping for it still finds it.

### 8.2 The conformance report

`npm run conformance -w @mosje/tokens` → `docs/ux4g/conformance-report.md`: coverage (755/755),
every resolved value, contrast per pair, and a diff against the previous run. **This is the
auditable artifact.** A machine-diffable table is stronger evidence than a grep for a prefix,
and it survives UX4G 4.0 as a mapping-table edit rather than an estate-wide breaking change.

### 8.3 Why `ux4g-web-components` is not installed

7.6 MB stylesheet plus a 286 KB runtime with 11 MutationObservers and 42 `innerHTML` writes that
rewrite the DOM React owns — it breaks hydration in Next 16 and would regress every portal.
**We conform to the specification, not the distribution.**

### 8.4 The Figma sync contract *(new — replaces the current exporter)*

Three constraints Figma imposes, and the design that satisfies them:

| Constraint | Consequence |
|---|---|
| Variables are **Color · Number · String · Boolean**, and **Numbers are unitless** | `"16px"` cannot round-trip. The unit lives in DTCG `$type` / `$extensions` and is reattached at CSS emit. **Corollary: the px→rem decision (§11.2) never reaches Figma** — it is purely an emit-side concern. |
| **Modes are per-collection and plan-limited** | 3 brands × 3 themes × 2 densities × 2 surfaces = 36 combinations. These cannot be modes on one collection, and shouldn't be — the axes are orthogonal. |
| **Paths are `/`-delimited trees; aliases are first-class** | The tier chain is expressible — but only if the export emits **references**, not resolved literals. Today it emits literals (§2.5). |

**One axis per collection.** Each token lives in the collection whose axis it actually varies on:

| Collection | Modes | Holds |
|---|---|---|
| `1 · Reference` | none | palette, raw scales |
| `2 · Color` | `brand` × `theme` | `bg` `text` `icon` `border` `outline` `overlay` `shadow` `chart` `on` `layer` |
| `2 · Type` | `surface` | `type/*` |
| `2 · Space` | `density` | `space` `inline` `stack` `padding` `section` `density` |
| `2 · Static` | none | `radius` `opacity` `z` `border/width` `motion` |
| `3 · Component` | `brand` × `theme` | `action` `control` `spinner` |

The exporter must emit, per collection: variable **type**, **alias references** (not resolved
values), **per-mode values**, and the §6.3 contrast class in each variable's **description**.

> **Verify before Phase 2:** `2 · Color` needs `brand` × `theme` modes. Confirm the workspace's
> per-collection mode limit; if it is below what `brand` × `theme` requires, split into
> `2 · Color / Brand` and `2 · Color / Theme` with the theme collection aliasing the brand one.

---

## 9. CI contracts

| # | Test | Asserts |
|---|---|---|
| 9.1 | `naming-grammar.test.mjs` | Every path parses against §5; **no segment contains a hyphen**; `ref`/`cmp` never begin a Tier-2 path. Also runs `--audit-reference` against UX4G's 755 names to keep §2.1 reproducible. |
| 9.2 | `prominence-contract.test.mjs` | Per family, per `data-brand` × `data-theme`: luminance strictly monotonic across `subtlest…boldest` **and** each rung meets its §6.3 contrast class. |
| 9.3 | `on-pair-contrast.test.mjs` | Every `--sa-on-*` meets 4.5:1 against its paired background **across the enumerated axis product**, not per-axis (R2). |
| 9.4 | `deprecation.test.mjs` | Every deprecated token still resolves and appears in the generated codemod map (§10.1). |
| 9.5 | `ux4g-parity.test.mjs` *(existing)* | All 755 published names present; structural values exact. |
| 9.6 | `manifest.test.mjs` | `dist/manifest.json` — every token with path, tier, collection, `$type`, value per mode, contrast class, description and deprecation — is complete and current (R3). |
| 9.7 | `figma-roundtrip.test.mjs` *(new)* | Export → re-import → path set, types, alias edges and per-mode values are identical. This is what makes "in sync" a property rather than a habit. |
| 9.8 | `brand-contrast` / `mode-contrast` *(existing)* | Updated for `data-brand`. |

**Lint:** `--sa-ref-*` outside `packages/tokens/**` and generated CSS is an error.

### 9.9 The freeze criterion

**The grammar is frozen once CI is green and all 245 `--ds-*` call sites map.**

Both halves are mechanically checkable, which is the point — this architecture has been revised
three times, and each revision reopened a naming debate that had no defined end. Without a written
stopping condition the next revision reopens it again.

- *CI green* = the §9 table plus `visual-contract`, `slot-disjointness` and `tier2-parity`.
- *All 245 mapped* = the legacy allowlist in `test/naming-grammar.test.mjs` (§5.1b), which may
  only shrink, reaches zero unmapped entries.

After the freeze, a slot dictionary changes only by the deprecation path in §10 — an additive
rename with both names live and a generated codemod entry — never by editing a dictionary in
place. Renaming a word in place is exactly what §5.1c had to undo.

The two ambiguities pinned in §5.1c are **inside** the freeze, not blockers of it: they are
recorded, gated, and cost a rename to fix. Deciding them is a deliberate post-freeze change.

---

## 10. Migration

### 10.1 The deprecation map is generated, not curated

Measured 2026-08-07:

| | Count |
|---|---|
| Distinct `--ds-*` names **declared** in generated CSS | **342** |
| Distinct `--ds-*` names **referenced** in app / DS source | **245** |
| Additionally referenced via the Tailwind preset / `@theme` | 33 |

v1's "~692" was a declaration count inflated by mode-block repeats. The real carrying cost is
**~245**. Names with **zero call sites are deleted, not aliased** —
`build/generate-deprecation-map.mjs` regenerates the set each build, so the alias sheet shrinks
on its own as call sites migrate.

### 10.2 Nothing breaks at any phase

Every `--ds-*` name with a live call site keeps resolving. Migration is per-file, opt-in and
codemod-assisted from the generated map.

### 10.3 The shared-build hazard (R4)

There is **one** Tailwind build in `apps/hub`, with per-portal values rebound under
`[data-portal="<slug>"]` in `apps/hub/src/app/portals/<slug>/<slug>.css`. Any rename ripples
through the v3 preset, the v4 `@theme` and every portal CSS at once. Required before Phase 3:

- a **named owner** for `@mosje/tokens`
- a **freeze window** on `apps/hub/src/app/globals.css` and the portal CSS files
- a **tagged rollback commit** and a documented revert command
- a semver + release-note story for `@mosje/tokens` consumers

### 10.4 Figma is a person, not a phase (R5)

§8.4 makes the export mechanical, but the first library restructure — creating six collections
and rehoming existing variables — is hand-done. Budget it as headcount, starting in parallel
with Phase 2.

---

## 11. Decisions taken

| # | Question | Decision |
|---|---|---|
| 11.1 | Contact the UX4G team? | **Open.** One email resolves the conformance premise, the 4.0 breaking-change risk, and whether our extensions (charts, fluid type, HC theme, bilingual, the contrast contract) can be upstreamed. Cheapest unexplored action in this spec. |
| 11.2 | `rem` vs `px` | **Adopt `rem`,** scoped: **type sizes, line-heights and type-derived spacing in `rem`; borders, hairlines and radii stay `px`** (sub-pixel `rem` borders render inconsistently). `rem` text honours the user's browser font-size, which WCAG 2.1 §1.4.4 depends on. Per §8.4 the unit never reaches Figma, so this is an emit-side change only. Closes the divergence in `docs/ux4g/UX4G-Code-Readiness-Audit.md`. |
| 11.3 | Does UX4G Figma ship colour modes? | **Yes — confirmed.** Its Color Styles page carries Light/Dark columns with semantic tokens bound to *different ramp steps* per mode (`Text/Neutral/Primary` → `Neutral/900` light, `Neutral/50` dark) and `Disabled` bound to the `A` alpha variants. Structurally identical to ours, so §8.1's generation is a mode-for-mode map. |
| 11.4 | Chart / data-viz colours | **Keep SAMAVESH's as built.** UX4G 3.0 defines no data-visualisation tokens, so there is nothing to conform to. The 12 categorical values stay literal — they are chosen for mutual perceptual distinguishability, which binding to a hue ramp would silently break. Rehomed to `chart/*`. |
| 11.5 | `secondary` / `tertiary` brand values | **Deferred to a separate activity.** Both will be derived from the orange and green in the SAMAVESH brand mark. This spec fixes the **paths** (`color/{secondary,tertiary}/<step>`, `*/brand/{secondary,tertiary}/*`) so the derivation drops in later without touching Tier 2 or Tier 3. Until then they resolve to the current saffron ramp and a placeholder. |
| 11.6 | What are `blue-light` / `blue-dark`? | **Two brand palettes, not appearance themes** — `blue` (gov-blue `#0373df` + saffron + warm grey) and `navy` (gov-navy `#003366` + green + cool grey). Both render on light surfaces. Renamed to `data-brand="blue"` / `"navy"` (§4.2); the light/dark wording collided with `data-theme` and caused exactly the misreading it invited. |

---

## 12. Rollout — vertical slice first

The horizontal 8-phase plan in v1 is withdrawn: nothing would have been provably correct until
Phase 6.

### Phase 0 — Prove the grammar (½ day)

Write `naming-grammar.test.mjs`; run it against UX4G's 755 published names **and** the proposed
`--sa-*` paths. Fix the five `design.md` errors (§13).

> **Status:** the §2.1 measurement has been taken (ad-hoc script, 2026-08-07) and is what
> reversed v1. **The committed test file does not exist yet** — writing it, so the result is
> reproducible in CI rather than in a shell transcript, is the actual first task. The
> `--audit-reference` flag in §9.1 is part of that work.

### Phase 1 — Vertical slice: Button (1 week)

One component, every layer, end to end:

```
Tier 1 hues Button needs  →  Tier 2 roles  →  Tier 3 action matrix (generated)
  →  rebind <Button>      →  --ds-* aliases  →  --ux4g-* compat  →  conformance report
  →  §9.2 + §9.3 contrast →  Figma collections + §9.7 round-trip
```

Ship it. The grammar's real defects surface here, not in a spreadsheet of 140 role tokens, and
this is the only cheap way to prove §8.4's round-trip before committing to it. **No further
phase starts until this slice is green and merged.**

### Phase 2 — Widen Tier 1 & 2

15 hues × 11 steps + alpha; the four missing structural scales; the full colour-role matrix with
the fixed ladder; the 15-token link set; states. Figma library restructure (§10.4) runs in
parallel.

### Phase 3 — Remaining components

Input, Chip, Toggle, Checkbox, Radio, Card, Badge — each a vertical slice, each generated.
Requires §10.3's owner, freeze window and rollback in place first.

### Phase 4 — `on/*` pairs and `layer/*`

### Phase 5 — Decomposed elevation

`x/y/blur/spread` × key/ambient × 5 levels, brand- and theme-aware. Composed
`--sa-elevation-*` retained as aliases.

### Phase 6 — Axis rename

`data-color-mode` → `data-brand`, values `blue-light`→`blue`, `blue-dark`→`navy`. Codemod plus a
deprecated read-alias for one minor version.

### Phase 7 — Docs, manifest, sync

Per `.claude/rules/design-system.md`: update `design.md` (and bump its `Last reviewed`),
`AGENTS.md`, the design-system pages under `apps/hub/src/app/design-system/` and `nav.ts` (which
keeps `llms.txt` correct), **add a changelog entry at
`apps/hub/src/app/design-system/resources/changelog/page.tsx`** — `npm run check:changelog` gates
this in CI — then re-run `npm run build -w @mosje/tokens && npm test -w @mosje/tokens`. Publish
`dist/manifest.json` (R3).

Phases 0, 5 and the Figma track are independent and may run in parallel.

---

## 13. `design.md` corrections required in Phase 0

| Documented | Reality |
|---|---|
| `--ds-btn-radius`, `--ds-input-height` cited as Tier 3 examples | do not exist (0 matches) |
| `--ds-border-control` | does not exist |
| `--ds-radius-pill: 9999px` | actual token is `--ds-radius-full: 999px` |
| `--ds-duration-base: 300ms` | actual `250ms` |
| `--ds-duration-slow: 500ms` | actual `400ms` |

§9.6's manifest check prevents recurrence — documented names are diffed against emitted ones.

---

## 14. What was rejected, and why

| Rejected | Reason |
|---|---|
| `--ux4g-*` as the app-facing prefix (v1) | UX4G's contract carries 23 structural inconsistencies with no route out (§2.1); name–value divergence voids paste compatibility (§2.2) |
| `--ux4g-sa-*` extension namespace (v1) | A symptom of renting a namespace. With one owned prefix it is unnecessary. |
| `--sa-sys-*` marker on Tier 2 (v2) | Four characters on the 90 %-case token, justified by lintability a manifest already provides. Bijection is preserved by reserving `ref`/`cmp` instead (§4.1). |
| Hyphenated slot values (v1, v2) | 21 of UX4G's 23 structural violations. §5.2 makes it impossible here. |
| Enshrining UX4G's prominence ladder (v1) | Only justified by parity; parity now lives in a generated layer (§8.1) |
| A purely aesthetic ladder (v2) | Says how loud a colour is, not what you may do with it. §6.3 makes it a contract. |
| Resolved-literal Figma export (current) | Carries no types, aliases, modes or collections — sync by discipline, not by pipeline (§2.5) |
| Horizontal 8-phase rollout (v1) | Nothing provably correct until Phase 6 |
| Becoming the de facto national UX4G distribution *now* | Priced at "one engineer-quarter" with no governance path, on a foundation that has not shipped one correct Button. Revisit after Phase 3; §11.1 is the cheap first move. |
