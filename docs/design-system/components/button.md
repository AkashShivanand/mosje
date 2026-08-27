# Button

The estate's most-used component: **565 consumers** — 494 `<Button>`, 63
`buttonClasses()`, 8 raw `.ds-btn`. Every decision here is multiplied by that,
and so is every defect.

- **Code** — `packages/design-system/components/actions/button.{tsx,css}`
- **Figma** — `Button` set `609:283111`, page *Buttons* `2141:296705`
- **Docs** — `/design-system/components/actions/button`
- **Stories** — `apps/storybook/stories/Button.stories.tsx`

---

## API

| Axis | Values | Default |
|---|---|---|
| `variant` | `primary` · `success` · `danger` · `neutral` | `primary` |
| `appearance` | `filled` · `outlined` · `text` · `tonal` · `inverse` · `inverseOutlined` | `filled` |
| `size` | `sm` (32px) · `md` (40px) · `lg` (48px) | `md` |
| `iconLeft` / `iconRight` | `ReactNode`, rendered `aria-hidden` | — |
| `href` | renders an `<a>` instead of a `<button>` | — |

`buttonClasses(variant, appearance, size, className)` returns the same class
string without rendering, for `next/link` and other elements.

**`variant` is intent, `appearance` is prominence, and they are independent.**
That split is the component's best idea and it is worth protecting: it is why
`danger` can be quiet (`danger` + `text`) and `neutral` can be loud (`neutral` +
`filled`) without either needing a new word.

### `neutral` — the variant with no signal

For an action with no semantic charge: dismiss, reset, "start over". It exists
because there was previously no way to say "quiet", and the absence had a cost —
the chatbot's reset shipped **outlined in the estate's rejection red** for what
is housekeeping. On a portal where red means "your application was rejected",
spending it on a reset devalues the signal.

It is the **only variant bound to Tier 3** (`cmp/action/neutral/*`). The other
three still reach into Tier-1 `ref/color/*/source`; see Open below.

---

## Token map

| Property | Source | State |
|---|---|---|
| Radius | `shape/8` | ✅ 720/720 bound in Figma |
| `neutral` colour | `cmp/action/neutral/<appearance>/<state>/<bg\|text\|border>` | ✅ Tier 3 |
| `primary` / `success` / `danger` colour | `bg/*`, `text/*`, `on/*` in code; **Tier-1 `ref/*` in Figma** | ⚠️ open |
| Height | raw `32/40/48px` | ⚠️ open — and a fixed `height`, see A11y |
| Padding (code) | `padding/16`, `padding/24` | ✅ |
| Padding (Figma) | **`Font Size/*` — the Type collection** | ⚠️ open, 1,440 bindings |
| Focus ring | `--sa-focus-ring`, or a per-variant `--_ring` for success/danger | ✅ |
| Press feedback | `scale(0.97)`, suppressed under `prefers-reduced-motion` | ✅ |

---

## Accessibility — what is true, not what was intended

**Text contrast passes AA on all 16 variant×appearance pairs**, 4.64 – 16.18.

**Non-text contrast (WCAG 2.2 §1.4.11, needs 3:1 against the page) — five failures:**

| variant | appearance | boundary | |
|---|---|---|---|
| primary | tonal | 1.42 | ✗ |
| success | tonal | 1.52 | ✗ |
| danger | tonal | 1.21 | ✗ |
| neutral | tonal | 1.35 | ✗ |
| neutral | outlined | 2.15 | ✗ |

Every tonal button in the system is invisible as a control until you read its
label. Context for whoever fixes it: **tonal has 2 consumers in 494 buttons**,
and `inverseOutlined` has 1.

**Target size.** 32 / 40 / 48px. All three clear the **24×24** WCAG 2.2 §2.5.8
Level AA minimum. **44×44 is §2.5.5 (Enhanced), Level AAA** — only `lg` reaches
it. UX4G 3.0 recommends 44×44 *on mobile* plus 8px between adjacent targets;
treat that as a touch-context recommendation, not a WCAG failure on a pointer
surface. See `.claude/rules/standards-precedence.md` — this exact misquote was
on the docs page in three places until 2026-08-25.

**Disabled.** A `<button>` uses the native `disabled` attribute. **A link-button
does not:** `<Button href disabled>` emits `<a disabled>`, which is not a valid
attribute — measured `pointer-events: auto`, `opacity: 1`, `cursor: pointer`,
`aria-disabled: null`, and still in the tab order. Do not ship one until fixed.

**Loading.** There is none. Pass `aria-busy` and `disabled` yourself.

**Icon-only.** The label belongs on the button, never the glyph:
`<Button aria-label="Search"><Icon name="search" /></Button>`. Not enforced in code.

---

## Open

Full evidence in `button-audit.md`; the brief that closes them is
`button-cleanup-prompt.md`.

### Closed 2026-08-27

| # | Was | How |
|---|---|---|
| 1 | `disabled` inert on link-buttons | The `<a>` now drops `href` and carries `aria-disabled="true"` + `role="link"`. Dropping the href is the fix; an anchor without one is not focusable or activatable, so nothing has to swallow events. Pinned in `e2e/design-system/button.spec.ts` |
| 2 | Fixed `height` clips the label at 200% text (WCAG 1.4.4) | `min-height` + vertical padding (`sm` 4/16 · `md` 6/24 · `lg` 8/24), each size naming its own `--sa-type-*-lh`. Padding stays *under* the nominal height so `min-height` sets the ladder and the padding becomes headroom |
| 9 | `--_dark` dead (3 declarations, 0 uses); `--_ring` dead on primary and neutral | Deleted |
| — | **#3 was never five failures** | See the correction below. Four, all `tonal`. Now gated by `packages/tokens/test/action-nontext-contrast.test.mjs` |

### Still open

| # | Open | Why it is not fixed here |
|---|---|---|
| 3 | **Four** 1.4.11 boundary failures, all `tonal` (1.21–1.52:1) | Decided 2026-08-27: retire `tonal` rather than darken it. Held in the gate's exemption list, which may only shrink |
| 4 | 1,440 Figma padding bindings on the **Type** collection, 0 on Space | Rebinding is provable but touches all 720 variants |
| 5 | ~~46% of Figma colour bindings reach Tier 1~~ — **closed 2026-08-26**, and the number was wrong anyway | Zero `ref/color/*` remain on the Buttons page. What replaced it: **Figma models every state explicitly and the code does not** |
| 6 | 720 variants — `State` and `Icon` are variant axes that should be properties | Restructuring changes every instance in the estate |
| 7 | `inverse` / `inverseOutlined` absent from Figma entirely | Becoming a `tone` axis rather than a fifth Sub-type |
| 8 | `inverseOutlined` renders identically for all four variants | `danger` silently loses its signal |
| 10 | No `IconButton` in code, though Figma has a 60-variant set and UX4G says icon-only is a Button *prop* | Decided 2026-08-27: build it |
| 11 | `filter: brightness()` for hover/active — cannot be contrast-tested, does not repaint per brand | The matrix's own `$notes` already says this |
| 12 | **`--_color` is both the label ink and the border colour** | New. Text needs 4.5:1, a border needs 3:1, and they pull apart — which is why neutral's outlined border is a near-black 16.18:1 nobody chose. Split it into an ink and an edge |

### The correction to finding #3

The audit reported **five** 1.4.11 failures. There are **four**.

The fifth, "neutral outlined 2.15:1", measured `cmp/action/neutral/secondary/default/border`
(`#adb1b7`) — a token `button.css` does not bind. `.ds-btn--neutral` sets `--_color` from
`cmp/action/neutral/tertiary/default/text`, and `.ds-btn--outlined` paints its border with
`--_color`, so the rendered border is `#1e2124` at **16.18:1**.

This is the same error class as the "~400 button backgrounds on raw primary" claim corrected
in `docs/design-system/figma-ref-tier-cleanup.md`: **a token was measured where a component
was meant.** The defence is structural rather than editorial — the new gate parses the
variant blocks out of `button.css` and measures whatever they actually bind, so it cannot go
stale the way a hand-kept list does.

**The flip side is real, and it is now a Figma↔code divergence.** Figma binds outlined→`secondary`,
so the *library* paints that neutral border `#adb1b7` at 2.15:1 while the *code* paints
`#1e2124`. Two surfaces, two different borders, and the library's is the failing one.

---

## Rules

1. **One filled/`primary` per visual section.** More than one and neither reads
   as primary.
2. **`appearance="outlined"` is the secondary action** beside a primary.
3. **Never use `danger` for a non-destructive action.** Reach for `neutral`.
4. **On a solid brand surface use `inverse` / `inverseOutlined`** — never a
   `className` override. Roughly 50 files were hand-rolling `bg-white text-navy`
   before those existed.
5. **Icon-only buttons always carry `aria-label` on the button**, not the glyph.
6. **Edit the Figma set in place; never fork its key.** A new key silently
   breaks 565 consumers and every Code Connect mapping
   (`component-authoring.md` §11).
