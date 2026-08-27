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

### Also closed 2026-08-27

| # | Was | How |
|---|---|---|
| 3 | Four 1.4.11 failures, all `tonal` | **`tonal` retired**, not repaired — darkening its border would have made it `outlined`. Two consumers migrated. The gate's exemption list is now **empty** |
| 7/8 | `inverse`/`inverseOutlined` absent from Figma; `inverseOutlined` identical for all four variants | Replaced by **`tone="inverse"`**, an axis crossing `appearance`. Each intent takes its own scale at rung 100. Old words kept as deprecated aliases — the Ticker's route-out, the login shell and two Code Connect templates name them |
| 10 | No `IconButton` in code | **Built**, as a component rather than a prop, so `aria-label` is required by the type system |
| — | No loading state | **`loading`** sets `aria-busy` + disabled; deliberately does not swap the label |
| — | **A fifth 1.4.11 failure the audit missed** | See below. Fixed by the same change as 7/8 |

### The failure the audit missed

The audit measured every boundary against a **white page**. `inverse` exists precisely because
the button is *not* on white.

Measured on a brand surface, `inverse`/`outlined` failed 1.4.11: a flat
`rgba(255, 255, 255, 0.4)` border for every intent — **2.25:1 on `primaryScale/600`**
(`#005eb9`) and 1.91:1 on gov-blue. It cleared 3:1 on **navy alone**, the one brand surface
anybody had checked.

**Where it paints — and a correction.** The failure is real in the **portal login shell's
"Signing Into" bar** (`auth-parts.tsx`, `tone="hero"`), on the design-system docs and in
Storybook. It is **not** the Ticker's route-out, which the first draft of this note named:
`ticker.css` carries `.sa-ticker__action > :is(a, button) { border: 0 }`, stripping the border
inside the same cascade layer at higher specificity. That button has no edge to measure.

That was **the same error this section criticises the audit for**, made while correcting it —
a token measured where a component was meant. It got past a passing contrast gate, because the
gate reads token values and `button.css` bindings and cannot see a third stylesheet overriding
the outcome. Only the rendered element settles it.

**A latent oddity this turned up:** the Ticker asks for `inverseOutlined` and then removes the
border that makes it outlined. It should ask for `appearance="text"` with `tone="inverse"` and
say what it means. Left alone here because PR #207 is open on the ticker.

So the audit was wrong in both directions, and for opposite reasons: it reported a failure on
a token the component does not bind, and missed one on a surface it never measured. **The
surface a control sits on is part of the measurement.** The gate now names the surfaces
rather than assuming one, and separately asserts the component *binds* the tokens — because
these were fully modelled in the matrix long before anything read them, so fixing the values
alone would have changed nothing on screen.

### The Figma surfaces are synced (2026-08-27)

Code and the library disagreed in prose as well as in values, and prose drift is the kind
that gets believed. Eleven text nodes on the `Buttons` page were rewritten to match what
now ships:

| Where | Was | Now |
|---|---|---|
| Hero · at a glance | **5** boundary failures | **0** — tonal retired, inverse rebound |
| Hero · at a glance | **46%** colour on Tier 1 | **0%** — counted live: 0 of 2,257 colour bindings reach `ref/*` |
| 03 Size › `open` | "The height is a FIXED height" | "a MINIMUM, not a fixed height"; the frame is no longer named `open` |
| 04 States | "Loading is absent from both surfaces" | `loading` is a prop, and deliberately does not swap the label |
| 04 States | "A disabled LINK-button does not… Do not ship one" | it drops `href` and sets `aria-disabled` |
| 05 Accessibility | "Five boundaries do not [pass]" | "Every boundary now does too" |
| 05 Accessibility · measured | the five-value list including `neutral outlined 2.15` | tonal retired; the correction **and** the missed inverse failure both recorded |
| Component record | "OPEN · CODE — three defects that ship today" | "CLOSED · CODE — all three shipped defects are fixed" |
| Component record · parity | "inverseOutlined renders identically for all four variants" | inverse is a tone that crosses appearance; each intent carries its own border |

**The 46% was not this change's to fix, and was fixed anyway** — it belonged to the
2026-08-26 ref-tier cleanup and had simply never been carried onto the page. It was
verified before being rewritten, by walking all 3,436 nodes on the page and counting
colour bindings rather than trusting the claim in `design.md`: 2,257 bindings, **zero**
on `ref/*`.

**What was deliberately NOT touched:** the four `Sub-type=Tonal` component variants. The
appearance is gone from code, but deleting a Figma variant breaks every instance that
uses it, and that is a migration rather than a documentation fix. The Code Connect
template maps `Tonal` → `outlined` meanwhile, and this stays open below.

### The 15 library-only Color variables are reconciled (2026-08-27)

Pushing the inverse borders surfaced a count nobody could explain: the live `Color`
collection held **496** entries against the code's **481**. The first write-up called
thirteen of them unexplained. Both halves of that were wrong.

**The count is 15, not 13** — the 13 came from comparing against the *previous record's*
483 rather than against the code, which is the same class of mistake as measuring a token
where a component was meant.

**And they are all explained:**

| Extra | What | Why it is there |
|---|---|---|
| `border/brand/primary/hover`, `.../bolder` | 2 | The long-standing library-only pair. `hover` is still the only variable in the collection with no generated `codeSyntax`, which is the cross-check the record has always used. `bolder` is what the old note called `subtle` — renamed since the last read |
| `border\|icon\|text/status/{success,error,warning,info}/bolder` | 12 | **Open PR #200** (`ds/icon-style-bindings`) |
| `icon/neutral/subtler` | 1 | **Open PR #200** |

Verified by diffing `dist/tokens.css` across `main` and that branch: every one of the
thirteen is absent on `main` and present on #200.

So the library is **not holding orphans — it is ahead of `main` by exactly one unmerged
branch**, whose Figma side was pushed before its code side landed. The difference closes
when #200 merges. Nothing needs deleting, which is the outcome worth having: the honest
reading of an unexplained count is "find out", not "delete it" and not "absorb it".

### Still open

| # | Open | Why it is not fixed here |
|---|---|---|
| 4 | 1,440 Figma padding bindings on the **Type** collection, 0 on Space | Rebinding is provable but touches all 720 variants |
| 5 | ~~46% of Figma colour bindings reach Tier 1~~ — **closed 2026-08-26**, and the number was wrong anyway | Zero `ref/color/*` remain on the Buttons page. What replaced it: **Figma models every state explicitly and the code does not** |
| 6 | 720 variants — `State` and `Icon` are variant axes that should be properties | Restructuring changes every instance in the estate |
| 7b | Figma has no `Tone` property, and still has a `Tonal` Sub-type | Needs the Figma edit; the Code Connect template maps `Tonal` → `outlined` in the meantime |
| 10b | Figma's 60-variant IconButton set has no Code Connect template yet | The component now exists to map it to |
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
