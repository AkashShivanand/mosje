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

| # | Open | Why it is not fixed here |
|---|---|---|
| 1 | `disabled` inert on link-buttons | Behavioural change to 565 consumers; needs its own change and e2e pins |
| 2 | Fixed `height` clips the label at 200% text (WCAG 1.4.4) | Same — `min-height` changes every button's box |
| 3 | Five 1.4.11 boundary failures | Needs a decision on whether `tonal` survives at 2 consumers |
| 4 | 1,440 Figma padding bindings on the **Type** collection, 0 on Space | Rebinding is provable but touches all 720 variants |
| 5 | 46% of Figma colour bindings reach Tier 1 (900 of 1,956) | Estate-wide visual change; must be value-proven then re-recorded |
| 6 | 720 variants — `State` and `Icon` are variant axes that should be properties | Restructuring changes every instance in the estate |
| 7 | `inverse` / `inverseOutlined` absent from Figma entirely | Needs the Tier-3 `inverse` branch bound first |
| 8 | `inverseOutlined` renders identically for all four variants | `danger` silently loses its signal |
| 9 | `--_dark` dead (3 declarations, 0 uses); `--_ring` dead on primary and neutral | Trivial, but belongs with the Tier-3 move |
| 10 | No `IconButton` in code, though Figma has a 60-variant set and UX4G says icon-only is a Button *prop* | Needs a decision, not a patch |
| 11 | `filter: brightness()` for hover/active — cannot be contrast-tested, does not repaint per brand | The matrix's own `$notes` already says this |

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
