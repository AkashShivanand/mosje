# SAMAVESH Typography Unification — Migration Spec

> **Goal:** one shared typography token system in SAMAVESH DS that serves both the **website** (expressive)
> and the **portals** (dense) as two *modes* of the same semantic scale — a unified visual language.
> **Status:** SPEC / not yet implemented. No Figma or code changes made until this is approved.
> **Companion data:** [`docs/research/figma-typography-3way-comparison.md`](../research/figma-typography-3way-comparison.md) (raw 3-way extraction).

## Locked decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Token model & nomenclature | Adopt **Portal DS's** semantic, role-based convention as the SAMAVESH standard |
| 2 | Two scales, one system | **`Surface × Breakpoint` combined modes** on the Typography collection: `Website·D/T/M` + `Portal·D/T/M` (6 modes), same token names, different values per mode |
| 3 | Website surface values | **Keep the UX4G large/expressive ramp** at desktop (`display-1 = 80`, zero display tracking); mobile scale defined per §3/§6 |
| 4 | Responsive | **Design at breakpoints, ship fluid.** Figma carries explicit Desktop/Tablet/Mobile modes (so designers have real mobile type); `@mosje/tokens` ships `clamp()` **bounded by those breakpoint values** (Utopia model). |
| 5 | Missing pieces | Add `font-weight/bold`; keep `body-*-semibold`; replace orphaned line-height/letter-spacing with live variables; tighten website display line-heights; normalise `body-3` |

**Why breakpoint modes in Figma + fluid in code:** designers must have real Desktop/Tablet/Mobile type to lay out
mobile screens — a 2-mode (desktop-only) library would starve them of mobile sizes. So Figma holds explicit
breakpoints; code interpolates smoothly between them with `clamp()` (no runtime snap, bounded by designed values).
Figma allows only one mode axis per collection, so Surface and Breakpoint are combined into 6 modes.
*(Alternative: a two-collection layered setup gives independent Surface + Breakpoint axes — cleaner at scale, but
designers set two mode dropdowns per frame. 6 combined modes chosen for lower friction and parity with Portal's
existing D/T/M pattern.)*

---

## 1. Target token structure

Single collection **`Typography`**, mode axis = **`Surface × Breakpoint`** (6 modes):
`Website·Desktop`, `Website·Tablet`, `Website·Mobile`, `Portal·Desktop`, `Portal·Tablet`, `Portal·Mobile`.
All tokens exist in every mode. Designers set a frame's mode once to get that surface + breakpoint's type.

| Group | Tokens | Type | Scope |
|-------|--------|------|-------|
| Family | `font-family/heading`, `font-family/body` | STRING | FONT_FAMILY |
| Weight | `font-weight/regular`, `/medium`, `/semibold`, `/bold` | STRING | FONT_STYLE |
| Size | `font-size/<role>-<n>` (21 roles) | FLOAT | FONT_SIZE |
| Line height | `line-height/<role>-<n>` (21) | FLOAT | LINE_HEIGHT |
| Letter spacing | `letter-spacing/<role>` (display-1…6 + heading/title/body/label) | FLOAT | LETTER_SPACING |
| Paragraph spacing | `paragraph-spacing/<role>-<n>` (21) | FLOAT | PARAGRAPH_SPACING |

Roles: `display-1…6`, `headline-1…6`, `title-1…3`, `body-1…3`, `label-1…3`.

## 2. Rename map (current SAMAVESH/UX4G → new standard)

| Current (UX4G / SAMAVESH) | New standard | Note |
|---------------------------|--------------|------|
| `Font Family/Headings` | `font-family/heading` | |
| `Font Family/Label & Body` | `font-family/body` | |
| `Font Weights/noto-sans-0` | `font-weight/regular` | |
| `Font Weights/noto-sans-1` | `font-weight/medium` | |
| `Font Weights/noto-sans-2` | `font-weight/semibold` | |
| `Font Weights/noto-sans-3` | `font-weight/bold` | rename + **add to Portal** (Portal lacks Bold) |
| `Font Size/0…14` (raw ramp) | *retired* → mapped into `font-size/<role>-<n>` per mode | keep as hidden primitives only if needed |
| `Line Heights/*` (orphaned) | `line-height/<role>-<n>` (live) | **rebuild as live variables** |
| `Letter Spacing/*` (orphaned) | `letter-spacing/<role>` (live) | **rebuild as live variables** |
| *(none)* | `paragraph-spacing/<role>-<n>` | new group (from Portal) |

Portal DS names already match the target — Portal is the reference. Its only additions needed: `font-weight/bold`.

---

## 3. Value tables — `font-size` (px)

Website `min` = **proposed** mobile floor (UX4G had no responsive data — see §6). Portal `min` = existing Mobile value.
`max` = desktop reference. `clamp()` interpolates between `min` @360px and `max` @1280px.

| Role | Website max | Website min* | Portal max | Portal min |
|------|:-----------:|:------------:|:----------:|:----------:|
| display-1 | 80 | 40 | 56 | 40 |
| display-2 | 72 | 36 | 48 | 32 |
| display-3 | 64 | 32 | 40 | 28 |
| display-4 | 56 | 28 | 32 | 24 |
| display-5 | 48 | 26 | 28 | 22 |
| display-6 | 40 | 24 | 24 | 20 |
| headline-1 | 40 | 28 | 32 | 24 |
| headline-2 | 32 | 24 | 28 | 20 |
| headline-3 | 28 | 22 | 24 | 18 |
| headline-4 | 24 | 20 | 20 | 16 |
| headline-5 | 20 | 18 | 18 | 15 |
| headline-6 | 16 | 16 | 16 | 14 |
| title-1 | 22 | 18 | 20 | 16 |
| title-2 | 16 | 16 | 18 | 15 |
| title-3 | 14 | 14 | 16 | 14 |
| body-1 | 16 | 16 | 16 | 14 |
| body-2 | 14 | 14 | 14 | 13 |
| body-3 | 12 | 12 | 13 | 12 |
| label-1 | 14 | 14 | 14 | 14 |
| label-2 | 12 | 12 | 12 | 12 |
| label-3 | 11 | 11 | 11 | 11 |

\* Website mobile floors — best-practice values (§6): mobile display ceiling 40px, body held at 16px, tighter
mobile step ratio. `body-3` normalised so no size increases as the viewport shrinks (Portal Tablet 14 bump removed).

## 4. Value tables — `line-height` (px), `letter-spacing`, `paragraph-spacing`

### Website (single scale from UX4G text styles; min = proposed)
| Role | LH max | LS | ¶ | | Role | LH max | LS | ¶ |
|------|:-:|:-:|:-:|---|------|:-:|:-:|:-:|
| display-1 | **88** | 0 | 0 | | title-1 | 28 | 0 | 0 |
| display-2 | **80** | 0 | 0 | | title-2 | 24 | 0.15 | 0 |
| display-3 | **72** | 0 | 0 | | title-3 | 20 | 0.10 | 0 |
| display-4 | **64** | 0 | 0 | | body-1 | 24 | 0.50 | 16 |
| display-5 | 56 | 0 | 0 | | body-2 | 20 | 0.25 | 14 |
| display-6 | 48 | 0 | 0 | | body-3 | 16 | 0.40 | 12 |
| headline-1 | 48 | 0 | 0 | | label-1 | 20 | 0.10 | 0 |
| headline-2 | 40 | 0 | 0 | | label-2 | 16 | 0.50 | 0 |
| headline-3 | 32 | 0 | 0 | | label-3 | 16 | 0.50 | 0 |
| headline-4 | 28 | 0 | 0 | | | | | |
| headline-5 | 24 | 0 | 0 | | | | | |
| headline-6 | 20 | 0 | 0 | | | | | |

> **Display line-heights tightened (done):** UX4G's were loose/inconsistent (100/100/80/72/56/48 → 1.25–1.39).
> New values 88/80/72/64/56/48 give a graceful 1.10 → 1.20 progression (tighter the larger the type). The
> `Display/display-N` text styles bind `lineHeight → line-height/display-N`, so this is a **token** change, not a
> per-style override. Mobile display line-heights apply the same ratios to the mobile sizes.

### Portal (Desktop = max / Mobile = min) — from existing Portal variables
Line-height, letter-spacing (note negative display tracking) and paragraph-spacing bounds are the Portal
`Desktop`/`Mobile` columns already documented in the companion research doc §4b / §5b / §6. Tablet is dropped as a
hard mode and interpolated by `clamp()`.

---

## 5. Named text styles

Both surfaces expose the same 24 style names (adopt Portal's superset, incl. `body-1/2/3-semibold`):
`Display/1–6`, `Headline/1–6`, `Title/1–3`, `Body/1–3`, `Body/1–3-semibold`, `Label/1–3`.

**Text-style handling (important):** a Figma text style bakes fixed values and cannot flip per Surface mode.
Source of truth = **mode-aware variables bound to text nodes**; the enclosing frame's `Surface` mode reskins them.
Provide two thin style folders `Website/…` and `Portal/…` (each bound to variables resolved in that mode) *only*
for designers who work from the Styles panel.

---

## 6. Website mobile scale — best-practice derivation

UX4G was single-mode, so the Website surface needs a mobile scale. Principles:
- **Mobile display ceiling = 40px** — larger display type wraps awkwardly and dominates a 360–390px viewport.
- **Body stays 16px on mobile** (`body-1` = 16 both breakpoints) — readability, and 16px avoids iOS input-zoom.
- **Tighter step ratio on mobile than desktop** — mobile display uses ~1.1–1.15 between steps vs desktop's larger jumps.
- **Small sizes (title-3, body-2/3, labels) unchanged** — already at their readable floor.
- **Monotonic** — no role's size ever increases as the viewport shrinks (this is what forced the `body-3` fix).

Result: Website display `80/72/64/56/48/40 → 40/36/32/28/26/24`, headline `→ 28/24/22/20/18/16`, body/label held.
Line-heights follow the same ratio at mobile sizes. These are the recommended values; open for design adjustment.

---

## 7. `clamp()` emission (code)

For a token going `min` @ `Wmin=360px` → `max` @ `Wmax=1280px`:

```
clamp(<min>px,  <min>px + (<max> - <min>) × (100vw - 360px) / (1280 - 360),  <max>px)
```

`@mosje/tokens` computes the middle term at build time. `letter-spacing` for the display tier is fluid (clamp);
elsewhere it is static. `line-height`/`paragraph-spacing` use the same clamp form.

---

## 8. Code architecture (`@mosje/tokens` + consumers)

1. **DTCG source:** add typography tokens with a `Surface` dimension (two value sets: website default, portal).
   Mirror the existing color-mode pattern (`data-color-mode`) so the axes are consistent.
2. **Style Dictionary:** emit CSS custom properties — website under `:root` (default), portal under
   `[data-surface="portal"]`. Sizes/line-heights emitted as `clamp(...)` per §7.
3. **Consumers:** website renders default; portal shells set `data-surface="portal"` on their root
   (analogous to `data-color-mode`). Add to the DS `PortalShell`/layout so every portal inherits it.
4. **Docs:** update `packages/design-system/design.md` (type section) and `tokens.css` header; note the new
   `data-surface` axis alongside `data-color-mode`.

### Files in scope (code)
- `packages/tokens/src/*.json` — typography DTCG tokens (+ surface dimension)
- `packages/tokens/build/formats/*.mjs` — `clamp()` emitter for size/line-height/paragraph-spacing
- `packages/tokens/test/*` — contract snapshot updates
- `packages/design-system/tokens.css`, `design.md`, `AGENTS.md` — documentation + `data-surface`
- portal root layouts / DS shell — set `data-surface="portal"`

### Files in scope (Figma — SAMAVESH `qyzTEy8dlb3ssYctlkMX5o`)
- `Typography` collection: rename tokens (§2), add `Surface` mode axis, populate Website + Portal values,
  rebuild live `line-height`/`letter-spacing`, add `paragraph-spacing`, add `font-weight/bold`
- Text styles: two Surface-bound folders (§5)
- Re-publish library

---

## 9. Sequenced rollout

1. **Approve this spec** (esp. §3 Website mobile floors + §4 display LH tightening).
2. **Code first** — implement in `@mosje/tokens` behind the new `data-surface` axis; verify build + contract tests.
   Reversible, no external asset touched.
3. **Wire consumers** — `data-surface="portal"` on portal shells; smoke-test website + one portal.
4. **Figma** — restructure the SAMAVESH `Typography` collection to match the shipped code; re-publish.
5. **Reconcile** Portal DS + UX4G DS files to point at / match SAMAVESH (they're the same system; UX4G ≡ SAMAVESH today).

## 10. Open items for sign-off
- [x] **Website mobile scale** (§3/§6) — defined per best practice (display ceiling 40px, body held 16px).
- [x] **Website display line-heights** (§4) — tightened to 88/80/72/64/56/48 (1.10→1.20).
- [x] **`body-3` normalised** (§3) — monotonic; Portal Tablet 14 bump removed.
- [x] **Designer-friendly / mobile type in Figma** (§11) — resolved via 6 combined Surface×Breakpoint modes.
- [x] **`clamp()` bounds confirmed:** `Wmin = 360px`, `Wmax = 1280px`.
- [x] **Figma structure confirmed:** 6 combined `Surface × Breakpoint` modes (single Typography collection).
- [ ] Retire raw `Font Size/0…14` entirely, or keep as hidden primitive ladder. *(Default: keep as hidden primitives during migration, drop from public API.)*
- [ ] Tablet values: auto-interpolate (round midpoint) or hand-tune per role. *(Default: auto-interpolate, round to nearest even px.)*

---

## 11. Designer workflow — how mobile type stays available

The whole point of putting breakpoints in Figma (not just code) is that **designers always have real
Desktop / Tablet / Mobile type when laying out screens.** How it works:

- **Set the frame's mode.** A designer building a 375px mobile screen sets that frame's Typography mode to
  `Website · Mobile` (or `Portal · Mobile`). Every variable-bound text node instantly resolves to mobile sizes,
  line-heights and tracking. No separate "mobile file" or manual resizing.
- **Text bound to variables, not baked values.** Bind text node properties (size, line-height, family, weight,
  tracking) to the Typography variables so the frame's mode drives them. This is Figma's intended responsive-type
  mechanism.
- **Styles panel entry points.** Keep `Website/…` and `Portal/…` text-style folders for designers who work from
  the Styles panel. Because a Figma text style holds fixed values (it can't be mode-aware), if the team wants
  literal mobile sizes *in the Styles panel* they get a per-breakpoint style set (e.g. a `Mobile` folder); the
  forward-looking default is variable-bound text + frame mode, which needs no style duplication.
- **Parity with code.** The Figma breakpoint values are exactly the `clamp()` bounds shipped by `@mosje/tokens`,
  so what a designer sees at Mobile/Desktop is what renders at those widths; in-between widths interpolate smoothly.

**Net answer:** yes — designers get full mobile (and tablet) typography for every surface, by selecting the
frame mode; nothing is desktop-only.
