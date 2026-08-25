# Button — design-system architect's audit

**Component:** `packages/design-system/components/actions/button.{tsx,css}` · Figma `Button` set `609:283111`
**Scale:** 494 `<Button>` call sites + 63 `buttonClasses()` + 8 raw `.ds-btn` = **565 consumers**. This is the most-used component in the estate; every defect below is multiplied by that.
**Method:** measured, not eyeballed. Contrast computed from resolved token values; geometry and behaviour measured in a browser against the real stylesheet; Figma bindings counted through the Plugin API.

---

## Verdict

The Button is **structurally sound and factually mis-documented**. Its text contrast is clean on all 16 variant×appearance pairs, its radius is 100% tokenised, and its API is small and composable. But it carries **two accessibility defects that ship today**, **five WCAG 1.4.11 failures nobody has measured**, a Figma master whose padding is 100% bound to the wrong variable family, and documentation that contradicts itself inside the same page.

Blocking: **P0-1, P0-2, P0-3.** Everything else is debt with a plan.

---

## P0 — ships broken today

### P0-1 · `disabled` does nothing on a link-button

`<Button href="…" disabled>` renders `<a disabled>`. Measured in-browser:

| | |
|---|---|
| matches `.ds-btn:disabled, .ds-btn[aria-disabled="true"]` | **false** |
| `pointer-events` | `auto` |
| `opacity` | `1` |
| `cursor` | `pointer` |
| `aria-disabled` | **null** |
| keyboard-focusable | **true** |

The control **looks enabled, is clickable, and is in the tab order**. `disabled` is not a valid attribute on `<a>`, and the component never translates it to `aria-disabled`. A disabled "Download certificate" link is a live link.

**Fix:** when `href` is present, either drop `href` and render a real `<button>`, or set `aria-disabled="true"` + `role="link"` + remove from tab order and swallow activation. Never emit `<a disabled>`.

### P0-2 · A fixed `height` clips the label at 200% text (WCAG 1.4.4, AA)

Sizes are `height: 32/40/48px` — a hard height, not a minimum. Measured on `md` with the label at 32px (≈200%):

| | |
|---|---|
| height at 16px text | 40px |
| height at 32px text | **40px** — did not grow |
| `scrollHeight` vs `clientHeight` | **41 vs 38 → clipped** |

WCAG 1.4.4 requires content to remain readable and functional at 200% text with no loss of content. The label is cut off. This affects every button in the estate at browser zoom or an OS large-text setting — exactly the citizens a government service must not fail.

**Fix:** `min-height` + vertical padding instead of `height`, so the box grows with the text.

### P0-3 · Five WCAG 1.4.11 non-text-contrast failures

The boundary between a button and the page must reach **3:1**. Measured against `#ffffff`:

| variant | appearance | boundary vs page | verdict |
|---|---|---|---|
| primary | tonal | **1.42** | ✗ |
| success | tonal | **1.52** | ✗ |
| danger | tonal | **1.21** | ✗ |
| neutral | tonal | **1.35** | ✗ |
| neutral | outlined | **2.15** | ✗ |
| primary | outlined | 4.64 | ✓ |
| success | outlined | 11.67 | ✓ |
| danger | outlined | 9.10 | ✓ |
| all four | filled | 6.36 – 9.12 | ✓ |

Every **tonal** button in the system is invisible as a control until you read its label — there is no perceivable edge. Neutral outlined fails because its border is `neutralScale/300` (`#adb1b7`).

Worth knowing before you spend effort: **`tonal` has 2 consumers in 494 buttons.** `inverseOutlined` has 1. The cheapest correct fix for tonal may be to give it a 3:1 border; the cheapest *honest* option is to ask whether it earns its place at all.

**Text contrast, by contrast, is clean:** all 16 pairs land 4.64 – 16.18. No AA text failures anywhere.

---

## P1 — the documentation is not merely stale, it contradicts itself

### P1-1 · The docs page states the opposite of itself about touch targets

Same file, `…/design-system/components/actions/button/page.tsx`:

| line | claim |
|---|---|
| 309 | "Touch targets are always **≥44px**, enforced in CSS" |
| 318 | "Size `sm` … still meets the **44px**" |
| 507 | accessibility checklist: "**Every variant — including size sm — meets** the minimum target size. (WCAG 2.5.8)" |
| 385 | "32 / 40 / 48px tall … **only lg reaches the 44px**" |
| 550 | "Level AA requires 24×24px, which every size clears" |

**`sm` measures 32px.** Lines 309, 318 and 507 are false, and 507 is inside the accessibility checklist — the single place a reader is most entitled to trust. It also miscites the criterion: **2.5.8 is 24×24 (AA); 44×44 is 2.5.5 (AAA)** — the precise misquote `.claude/rules/standards-precedence.md` was written to stop.

### P1-2 · The docs page documents a loading state the component does not have

Lines 346, 525, 655, 661 describe `aria-busy="true"` being "set during loading", including as a satisfied accessibility criterion (WCAG 4.1.3). **`button.tsx` contains no loading state and sets no `aria-busy`** — a consumer must pass it by hand. The docs credit the component for work it does not do.

### P1-3 · The Figma documentation page is an unfilled template

`Button — Documentation (DS template)` (`4385:1634`):

- **1400px wide** where `figma-documentation-style.md` mandates **1680**.
- **16 text nodes, 0 on a published text style** — 100% unbound, against a rule that requires every text node bound or declared a specimen.
- No hero, no numbered sections, no specimen panels, no "at a glance" card. It is a flat list of headings.
- **No `Button — Component record` sibling frame.**
- Its vocabulary is a different component: *"Primary · Secondary · Outlined · Ghost (text) · Danger"*. The system has **Type** (primary/success/danger/neutral) × **Sub-type** (filled/outlined/text/tonal). "Secondary" and "Ghost" do not exist.
- Claims *"VARIANT PROPERTIES (Figma ↔ code, keep 1:1)"* then lists `appearance · size · state · iconLeading`. Figma's are `Size · Type · Sub-type · State · Icon`; code's are `variant · appearance · size`. **They are not 1:1 and the page asserts they are.**
- States *"Minimum touch target 44×44px — pad sm buttons to meet it"* — the rule the component breaks.
- Says **WCAG 2.1**; the estate targets **2.2**.

### P1-4 · No repo spec

`docs/design-system/components/button.md` does not exist, though the far-less-used Chatbot has one.

---

## P2 — Figma structure

### P2-1 · 1,440 padding bindings, every one to a **font-size** variable

All 720 variants, both sides, bound to the **Type** collection:

| bound to | count |
|---|---|
| `Font Size/6` | 640 |
| `Font Size/3` | 640 |
| `Font Size/1` | 160 |
| **Space collection** | **0** |
| unbound | 0 |

100% bound, 100% wrong family. This is the `crossFamily` class the space ratchet exists to shrink, concentrated in one component. A designer changing the type scale silently re-paddings every button in the estate.

### P2-2 · 46% of colour bindings reach into Tier 1

1,956 colour bindings across the set:

| tier | count | share |
|---|---|---|
| **Tier 1 `ref/*`** | **900** | **46%** |
| Tier 3 `cmp/*` | 639 | 33% |
| palette `*Scale/*` | 255 | 13% |
| Tier 2 semantic | 162 | 8% |

Top offenders: `ref/color/primary/source` ×255, `ref/color/ink/dark` ×247, `ref/color/success/source` ×192, `ref/color/danger/source` ×192. `tier-discipline.test.mjs` forbids app code writing Tier-1 code syntax; the library does it 900 times.

The 33% on Tier 3 is **entirely the Neutral variants added on 2026-08-25**. Every other Type predates that and reaches past Tier 2.

**Radius is the one clean axis: 720/720 on `shape/8`.**

### P2-3 · 720 variants, and the two axes that cause it

`3 Size × 4 Type × 4 Sub-type × 5 State × 3 Icon = 720`.

- **State is not a prop in code** — CSS `:hover/:active/:disabled` drive it. It is a 5× multiplier for something no consumer selects.
- **Icon is one 3-value variant** where code has two independent slots (`iconLeft`, `iconRight`) — a 3× multiplier, and it cannot express *both* icons at once, which code can.

Drop both to properties and the set is **48 masters**. `component-authoring.md` §4 caps variant explosion at ~30 and says push independent axes to properties.

### P2-4 · Figma has 4 Sub-types; code has 6 appearances

`inverse` and `inverseOutlined` **do not exist in Figma at all**. A designer cannot draw the button the portals actually use on a navy header.

---

## P3 — code hygiene

| # | finding | evidence |
|---|---|---|
| P3-1 | `--_dark` declared in 3 variants, **consumed nowhere** | grep: 3 declarations, 0 uses |
| P3-2 | `--_ring` declared 4×, consumed by **one** rule that lists only success and danger — primary's and neutral's are dead | button.css:106,116,126,177 vs :185 |
| P3-3 | `appearance="inverseOutlined"` renders **identically for all four variants** (white text, white border) — `variant="danger"` silently loses its signal | measured across 4 variants |
| P3-4 | Hover/active on `filled` and `tonal` use `filter: brightness()` — cannot be contrast-tested, does not repaint per brand mode, and creates a containing block for fixed descendants | button.css:216,220,272,276; the matrix's own `$notes` says exactly this |
| P3-5 | Raw literals: `letter-spacing: 0.1px`, `height: 32/40/48px`, `color-mix(…, white)` ×4, `--sa-color-neutralScale-0` (a Tier-1 palette rung in component code) | button.css:40,192,198,204,289–295,286 |
| P3-6 | No loading/busy state, though three industry systems ship one and our own docs claim we do | button.tsx |
| P3-7 | `buttonClasses()` duplicates the class-composition logic — two sources of truth | button.tsx:105–117 |
| P3-8 | The `href` branch casts props `as unknown as AnchorHTMLAttributes` and **drops `ref`** — `forwardRef` is typed to `HTMLButtonElement` and the anchor path ignores it | button.tsx:83–95 |
| P3-9 | Icon-only buttons have no enforced accessible name; the rule lives in prose only | button.tsx |

---

## What is genuinely good

Worth stating, because a brutal audit that finds only faults is not calibrated:

- **All 16 text-contrast pairs pass AA**, several with large headroom. The `--_fill` / `--_color` / `--_on` split is a correct and well-reasoned piece of design — it is what let the primary fill deepen without dragging outlined text with it.
- **Radius: 720/720 bound.** One axis done properly, and proof the rest is achievable.
- The press feedback (`scale(0.97)`, suppressed under reduced motion) is the right detail in the right place — defined once, inherited estate-wide.
- The API is small, composable and honest: no god-props, no boolean soup.
- `inverse`/`inverseOutlined` exist in code precisely because ~50 files were hand-rolling `className` overrides. That was the right call.
