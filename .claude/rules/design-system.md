---
paths:
  - "packages/design-system/**"
  - "packages/config/**"
  - "packages/tokens/**"
---

# Design-system rules (`packages/design-system/` — the Figma-synced source of truth)

This package is the **single source of truth** for the visual language across all 13 sites + 20 portals, kept in sync with the Figma library — **today by generated tokens and generated documentation data, NOT by Code Connect.**

**Phase 2 is underway.** Tokens are authored as DTCG JSON in `@mosje/tokens` (`packages/tokens/src/*.json`) and compiled by Style Dictionary v4 into the `--ds-*`/`--sa-*` CSS contract, a TS module, the Tailwind v3 preset (`@mosje/config`) and v4 `@theme`, and a Figma DTCG export. **Edit tokens in `packages/tokens/src/`, never in generated artifacts** (`packages/tokens/dist/`, `packages/design-system/tokens.css`, `packages/config/tailwind-preset.cjs`). Run `npm run build -w @mosje/tokens` to regenerate and `npm test -w @mosje/tokens` to assert the backward-compatible contract.

## Principles
- **Tokens first.** Define color/spacing/typography/radius as tokens (CSS variables + a TS export), named to match the Figma variables 1:1. Apps consume tokens; they never hardcode.
- **One component, one definition.** Each shared component (Button, Card, Header pieces, nav, etc.) lives here once and is imported as `@mosje/design-system`. No per-app forks.
- **Framework-agnostic where possible.** Tokens as plain CSS vars + a Tailwind preset (`packages/config`) so both Tailwind v4 (website) and v3 (portals) can consume the same values.
- **Code Connect is NOT set up, and cannot be on the current plan.** It needs a
  Developer seat on an Organization/Enterprise plan. There is still **no**
  `@figma/code-connect` dependency, so nothing here can be published or validated.
  This bullet used to read "every exported component maps to its Figma component; keep
  mappings validated", which was never true and made the gap invisible. The plan of
  record, including the per-component node map and the Icon mapping, is
  `docs/research/figma-code-connect-readiness.md`.
  - **Correction, 2026-08-18:** there are now **FOUR** templates, not two —
    `actions/button.figma.ts`, `utilities/accessibility-bar.figma.ts`,
    `auth/portal-login-template.figma.ts` and `auth/auth-parts.figma.ts`. The count in
    this bullet was stale, which is the same failure mode the bullet itself was written
    to correct. **`@figma/code-connect` is still NOT in package.json**, so none of the
    four can be published or validated — verify with
    `node -e 'console.log(require("./package.json").devDependencies["@figma/code-connect"])'`
    before believing any claim that Code Connect works.
  - **Superseded note, 2026-08-14:** the "zero `*.figma.ts(x)` files" half of this bullet is
    no longer accurate. Two templates landed, from two branches, because
    `component-authoring.md` §12a makes the template part of shipping a component:
    `components/actions/button.figma.ts` (foundation-documentation) and
    `components/utilities/accessibility-bar.figma.ts` (AccessibilityBar).
    **Treat them as authored-in-anticipation** — the standing warning applies: an
    unpublishable mapping reads as a finished integration, so do not infer from their
    presence that Code Connect works. `*.figma.ts` must stay excluded from the package
    tsconfig, or `npm run typecheck` fails on the virtual `figma` import.
  - **There is exactly ONE `figma.config.json`, at the repo root.** The two branches
    each added one — root and `packages/design-system/` — in ignorance of the other;
    they were consolidated on 2026-08-14. The root wins because only its `include`
    reaches both templates from where the CLI is run, and it absorbed the package
    config's `documentUrlSubstitutions`, which `button.figma.ts` depends on (it writes
    `url=<SAMAVESH>?node-id=…` rather than a full URL). **Do not add a second config**
    — two of them is a coin-flip about which the CLI reads.
- **What syncs code ↔ Figma today, in the absence of Code Connect:** tokens via
  `@mosje/tokens` (DTCG → Style Dictionary), and — on the Iconography page — the size
  scale and the 223-icon catalogue, both **generated** from their sources rather than
  hand-kept. Everything else is manual and therefore drifts; prefer generating a fact
  over transcribing it, because transcription is what the 2026-08-12 audit caught.
- **Component authoring standard (MANDATORY).** Every component created or updated —
  in Figma or code — must pass the checklist in **`.claude/rules/component-authoring.md`**:
  discover first, tokenise **everything** (zero raw values), nested parts are library
  instances (icons = Material Symbols glyphs, separators = the `Divider` component),
  add-and-flag anything missing, variants for structure + properties for options,
  match the reference visually, pass WCAG AA, flag questionable properties for the
  human, document in detail, and validate with a screenshot + zero-unbound audit.

## When extracting (phase 2)
1. Reconcile code tokens ↔ Figma variables (`/sync-figma <url>`); agree one canonical set.
2. Move tokens here first, then components, refactoring `dosje` to import them; then portals.
3. Don't break apps mid-extraction — verify each app still builds after each move.
4. Version the package; changes here ripple to every property, so review with `design-system-guardian`.

## AI design context — keep these THREE in sync (mandatory)

The system is built to be consumed by AI agents. Three artifacts make that work
and **must stay in lockstep with the tokens, the components, and the Figma
library** — they are the design system's contract for machines:

- **`packages/design-system/design.md`** — the authoritative AI design context
  (token vocabulary, theming axes, component inventory, non-negotiable rules).
  Never hand-copy token *values* into it; it points to the generated SoT.
- **`packages/design-system/AGENTS.md`** — the agent entrypoint (read-first +
  edit map + finish checklist).
- **`apps/hub/src/app/design-system/llms.txt/route.ts`** → served at `/design-system/llms.txt`
  — generated from `apps/hub/src/lib/design-system/nav.ts`, so it self-syncs with the portal.

**The rule:** any change to a token, a component, or a Figma sync MUST also:
1. Update `design.md` (and `AGENTS.md` if the component inventory changed) and
   bump the `Last reviewed` date in `design.md`.
2. Update the SAMAVESH portal (`apps/hub/src/app/design-system/`) — the relevant foundation/component
   page **and** `apps/hub/src/lib/design-system/nav.ts` if pages were added/removed (this
   keeps `llms.txt` correct automatically).
3. Re-run `npm run build -w @mosje/tokens` && `npm test -w @mosje/tokens`.

This is enforced as a step in `/sync-figma` and in the `design-system-guardian`
review. Treat docs/tokens/Figma drift as a defect, not a follow-up.

## Storybook must track the design system (enforced in CI)

**Every component exported from `packages/design-system/index.ts` has a story,
that story still describes the component, and it actually renders.** Storybook
is what BAs, QAs and designers open instead of reading source — it is only
useful if it reflects what ships. It had drifted to 2 of ~69 components because
nothing checked.

Four gates in **Design System Quality** enforce that, because "has a story" is
only the first of four ways it goes wrong.

### 1. Coverage — does a story exist? (`npm run check:storybook`)

`scripts/check-storybook-coverage.mjs`. A **ratchet**:

- A component with no story fails — *unless* it is listed in
  `apps/storybook/coverage-baseline.json` as pre-existing debt.
- A baseline entry that now **has** a story also fails, telling you to delete
  the line. That is what stops the backlog growing back.

**The backlog is empty and coverage stays N/N** — 69/69 when this was written
(August 2026), 71/71 after `AppSwitcher` was retired in favour of `DemoDock` +
`AppSwitcherPanel` + `DemoAccountsPanel`. The baseline still exists, but there
is nothing in it: a new component without a story fails outright. Do not add
entries to it to get a build green.

- After writing a story, `npm run check:storybook:baseline` prunes the entry.
- One file may document several components (`Controls.stories.tsx` covers the
  selection controls) — declare them with `@covers A, B, C` in the file's
  doc comment. **Imports are deliberately not a coverage signal**: a story that
  imports `Button` to sit next to what it is demonstrating does not document
  `Button`.
- Something that genuinely cannot have a story (a context provider, the
  CDN-loaded UX4G widget) goes in `NOT_COMPONENTS` in the script, **with a
  reason**. Sub-parts shown inside a parent's story go in `DOCUMENTED_BY`.

### 2. Parity — is the story still true? (`npm run check:storybook:parity`)

`scripts/check-storybook-parity.mjs`. Coverage cannot see what happens *after* a
story is written, so this closes two gaps:

- **A prop added that no story mentions.** The gate stays green while the
  documentation quietly stops being complete. Props are read from the
  design-system **source** (the package ships TypeScript directly, so there are
  no `.d.ts` files); native HTML attributes inherited from React are out of
  scope, as are `className`/`style`/`key`/`ref`.
- **A story left behind by a rename or deletion**, still documenting an export
  the barrel no longer has. That is worse than a missing story — a reviewer
  reads it and believes it.

"Mentions" is the bar deliberately: a prop explained in the file's doc comment
counts, because "here is when NOT to use this" is often the right guidance. What
it catches is the prop that exists in the component and nowhere else.

### 3. Types — are the props right? (`npm run check:storybook:types`)

`npm run typecheck --prefix apps/storybook`. Storybook builds with esbuild,
which strips types without checking them, so **a story compiles and renders with
a wrong prop value**. That is exactly how a `Badge` shipped with
`status="error"` — not a member of `BadgeStatus`, which is `"danger"` — emitting
a class with no CSS rule, so the badge rendered untinted. Neither the build nor
the smoke test can see that; only `tsc` can.

Two patterns to know when a story will not type-check:

- **A generic component** (`DataTable<T>`) — inferring through `typeof Component`
  erases the type parameter to its constraint. Annotate the meta with the props
  type instead: `const meta: Meta<DataTableProps<Application>>` and
  `type Story = StoryObj<DataTableProps<Application>>`.
- **A union props type** (`BarChartProps` is `{data}` | `{labels, series}`) —
  inferring through `typeof meta` makes every story owe a complete branch of the
  union. Same fix: annotate with the union and type stories from it.

Otherwise prefer `satisfies Meta<typeof Component>` — it is stricter, and it is
what makes a required controlled prop (`checked` + `onChange`) impossible to
forget. Put those in `meta.args` when the stories drive their own state.

### 4. Smoke — does it render? (`npm run check:storybook:smoke`)

`scripts/smoke-storybook.mjs` mounts **every** story in Chromium and fails on an
uncaught error, a console error, or an **empty canvas**. A story that satisfies
the counter but throws in the canvas is worse than no story, because the gate
then reports green while the documentation is blank.

It uses the Playwright already installed for `test:e2e` rather than
`@storybook/test-runner`, which would add Jest and a second Playwright pin for
what is one page visit per story. Portalled components (Modal, SideSheet,
Lightbox, Tooltip) leave `#storybook-root` empty by design, so the canvas check
counts portalled subtrees on `<body>` too — while skipping Storybook's own
`sb-*` chrome, which is always in the markup and would otherwise make every
empty canvas look populated.

### Writing a story

Follow `Alert.stories.tsx` and `Controls.stories.tsx`.

- **Read the props interface first.** Several components take required
  controlled props (`Checkbox`/`Radio`/`Toggle` need `checked` + `onChange`;
  `Radio` also needs `name` + `value`). Guessing produces stories that render
  empty or throw.
- **Use real MoSJE content** — scheme names, districts, beneficiary counts. Not
  "Lorem ipsum", not "Foo/Bar". Reviewers judge the component by what it holds.
- A `Playground` story with `argTypes` controls, then focused stories for the
  states that carry meaning (statuses, sizes, invalid, disabled, empty).
- **The doc comment says when to use it and when not to** — the distinction that
  saves someone choosing wrong, not a restatement of the prop table. Where the
  wrong choice is the common one, render it beside the right one so the failure
  is visible rather than described.

**When you add or change a component, the story is part of the change**, in the
same commit — exactly like `design.md` and the changelog.

## Design-context coverage (enforced in CI)

The rule above — *any change to a component MUST update `design.md`* — was
cultural, and culture does not survive a file rewrite. The UX4G accessibility
widget's entry landed and was then removed by a commit that renumbered
`design.md`'s version chain and dropped a whole range with it. The changelog
half survived, because the changelog has a gate. `design.md` had none, so the
widget's code sat on `main` while its authoritative context said nothing about
it — including that its telemetry defaults to OFF for privacy reasons, exactly
the kind of decision an agent must not flip blind.

`scripts/check-design-context.mjs` closes that. A **ratchet**, same shape as the
Storybook coverage gate: a component exported from the barrel and not mentioned
in `design.md` fails, unless it is declared in
`packages/design-system/design-context-baseline.json`; a baseline entry that is
now documented also fails, so the backlog cannot grow back.

- Run it with `npm run check:design-context`.
- `npm run check:design-context:baseline` rewrites the baseline.
- `DESIGN_MD=<file>` points it at a fixture — that is how the gate itself is
  exercised, because a check nobody has watched fail cannot be trusted.
- **The exclusion lists are shared** with the Storybook gate, in
  `scripts/lib/ds-exports.mjs`, so the two cannot disagree about what a
  component is. Note the deliberate split: `NOT_COMPONENTS` (constants, types —
  excluded from both) versus `NOT_RENDERABLE_IN_STORYBOOK` (real components that
  cannot be rendered in Storybook but **must** be documented). That split is not
  decoration — with one shared list, `UX4GAccessibilityWidget` was exempt from
  the very gate written to catch its disappearance.

**What it does not do:** mentioning a component is a low bar. It proves a
section still exists, not that it is still true. The precise loss that motivated
it — an entry vanishing from inside a surviving section — is still invisible to
it. Treat a green tick as "nothing was deleted wholesale", not as "the docs are
correct".

## Icon size scale — a ratchet, not a sweep (enforced in CI)

**Do not add a new off-scale icon size.** The scale is `16 · 20 · 24 · 32 · 40 · 48 ·
64`, it is generated from the stylesheet, and the size comes from the **`size` prop** —
a CSS class (`h-5 w-5`, `h-[18px]`) sets the box but **not** the `opsz` optical-size
axis, so the glyph gets drawn for one size and displayed at another.

213 of 762 call sites are currently off the scale, 126 of them at `size={14}`. That is
**known, declared debt**, not an oversight: 14 was chosen to sit against 14px body text,
and raising 126 glyphs by 2px moves row heights in dense admin tables across seven live
portals. **The decision (2026-08-12) is to let it go as the pages are redesigned one by
one** — a redesign rewrites the sizing for free, so sweeping now would pay for it twice
and take all the regression risk up front.

`tools/icon-audit/check.mjs --gate` is what makes deferring safe, and it is the same
**ratchet** shape as the Storybook and design-context gates:

- `npm run check:icon-scale` — the gate. New file with off-scale sizing, or a growth in
  a baselined file, **fails**.
- A count that **shrinks** also fails, telling you to re-run
  `npm run check:icon-scale:baseline` and commit it in the same change. That is what
  stops a redesign's gain from being quietly given back later.
- `npm run check:icon-scale:report` — the full picture, including the per-file ordering
  to work through and the 9 icon names Figma's starter set is missing.

**The baseline is PER FILE on purpose.** One global count would let a redesign remove
five off-scale icons from one page while another page added five, and report clean.

When you redesign a page, map `10 · 12 · 14 · 15 → 16`, `18 · 22 → 20`, and take
`28` and `56` case by case. Full findings: `docs/design-system/icon-audit.md`.

## Typography linkage — a ratchet, and the family that had NO gate (enforced in CI)

**Typography had no gate of any kind until 2026-09-01.** Colour had stylelint plus six
contract tests, spacing and radius each had a census and a per-page ratchet, icons had a
per-file one. Font size — 21 roles, 73 custom properties, the most visible thing on a
government page — had nothing. `check:ds-linkage` said so out loud every time it passed:
*"every fill, stroke, padding, gap and radius resolves through the design system."* Font
size is not in that sentence, and it was not in the checker's property table.

The audit that found this measured the cost:

| | |
|---|---|
| Literal font sizes across the estate | **562** |
| …of them OFF the 15-step ramp | **224** — 9, 10, 12.5, 13, 15, 17, 18, 19, 21, 26, 30, 34, 36, 38, 42, 44, 50, 62px |
| `13px` alone | **71** occurrences |
| Raw `letter-spacing` against 10 tracking tokens | **100** |
| Files affected | **75** |

Three specific defects it also surfaced:

- **`document-library.css` shipped `var(--sa-type-body-4-size)`** — a token that has never
  existed; the body ramp is 1–3. CSS drops an undefined `var()` in silence, so that text
  rendered at whatever it inherited and nothing said a word. Same file, `--sa-shape-md`,
  same story. `check:dangling-vars` catches that class; nothing caught the *literal*
  people reach for instead.
- **A second, complete, hand-maintained type scale in `apps/hub/src/app/globals.css`** —
  the `@theme` block labelled "smile-admin type scale", 19 hardcoded `--text-*` sizes,
  leadings and trackings, several of which (44px, 26px, `-0.02em`) the ramp cannot
  express at all.
- **The adoption split maps exactly onto the `ds-linkage` scope list.** The design-system
  package and the docs are largely bound; the portals and the website marketing
  components are not — and only `e-anudaan` of the eight portals was in scope. A gate
  reporting a clean estate was measuring the wrong estate.

### The gate

`tools/type-linkage/check.mjs`, wired as `npm run check:type-linkage` in `npm run check`
and in **Design System Quality**. It shares its source-scanning machinery with
`ds-linkage` via `tools/ds-linkage/regions.mjs` — one parser, one exemption vocabulary,
one definition of "this line is styling". The two gates ask different questions of the
same regions; a hand-maintained second copy of that parser is the failure this estate has
recorded five times over.

It checks four properties in CSS, Tailwind arbitrary values and React style objects:
`size`, `leading` (**including unitless ratios**, which no px-grep can see), `tracking`
and `family`. A `size` is classified further — `size-off-ramp` is the worse half, because
it needs a DESIGN decision rather than a binding.

**Two deliberate non-findings**, and both matter:

- **`font-size` on a Material Symbols glyph is ICON sizing**, and `check:icon-scale`
  already owns it with its own seven-step scale and its own baseline. Two gates claiming
  one declaration means one of them is always wrong. Anything whose selector or line
  names an icon is handed over and counted separately, so the hand-off stays visible
  rather than looking like an omission. 96 declarations currently sit there.
- **`font-weight` has no token by design** (CLAUDE.md — "write the number, as button.css
  does"), so a weight literal is correct.

### Why a ratchet and not a sweep

Snapping 71 sites from 13px to 12 or 14 moves text on live government pages — the
website's organisation pages, pm-ajay, eutthan-admin — and every one needs a visual audit
first. A ratchet costs nothing today, refuses to let the number grow, and **fails when a
count SHRINKS without the baseline being lowered in the same change**, so the backlog can
only go down.

The baseline is **per file**, in `tools/type-linkage/baseline.json`. One global count
would let a redesign clean five sites off one page while another page added five, and
report success for a net change of nothing.

All four failure modes were exercised by deliberately breaking them — new file, grown
count, shrunk count, and a declared `ds-exempt(specimen)` — per the rule that a check
nobody has watched fail cannot be trusted.

### `ds-linkage` went estate-wide, and the estate was cleared to ZERO

Only `e-anudaan` of the eight portals had ever been in scope, and the website was in
nothing at all — so a gate reporting a clean estate was measuring the wrong estate. All
23 scopes are now `gated: true`, and all **867** findings they exposed are cleared.

| surface | was | now |
|---|---|---|
| pm-ajay (routes + components) | 489 | **0** |
| eutthan-admin (routes + components) | 224 | **0** |
| smile-admin · scw · nhapoa · tg · nmba | 128 | **0** |
| website (routes + components) | 43 | **0** |
| design-system docs | 12 (found only after the fix below) | **0** |

**What the sweep actually did**, and the shape is worth copying:

1. **Lengths were bound by property and layout AXIS** — `padding*` → `padding`, a vertical
   gap or margin → `stack`, a horizontal one → `inline`, `border-radius` → `shape`, with a
   bare `gap` taking its axis from its own rule's `flex-direction`. Exact rungs bind with
   no pixel movement; the ladder steps by 4 above 8, so `10 · 14 · 18 · 22 · 28` are exact
   ties and were resolved **DOWN**, floored at the smallest non-zero rung. Down tightens,
   which is recoverable by eye; up inflates every one of them by 2px and, on a dense admin
   dashboard with fixed-width rails, that is the direction that causes wrapping. The floor
   is what stops a 1px inset rounding to nothing — 0 is the *absence* of a value.
2. **Colours were routed through each portal's OWN palette first.** 60 loose literals in
   `pm-ajay.css` alone became 32 role-named entries (`--pm-row-hover`, `--pm-track`,
   `--pm-on-navy-88`), so a rule now names what the colour is *for*. Not one rendered
   colour changed: a literal was only ever replaced by a variable already holding it.
3. **Only then was the palette DEFINITION block declared**, with the new
   `portal-palette` exemption category. See the divergence register.
4. **Two colours were genuinely bindable and were bound**: `--primary-500` and `--pm-navy`
   both resolve to `#003366`, which is `--sa-color-brand-navy` — defined once, no mode
   variation, so binding it cannot leak a theme into a portal that has no brand modes.
   `#0373DF` across the website's `bg-[#0373DF]` classes is gov-blue, already exposed to
   Tailwind as `--color-primary`; those are now `bg-primary` and retheme with the estate.

**Two precision bugs in the gate itself surfaced during the sweep, and both were fixed:**

- **`prop` was mis-attributed for every bare numeric.** A `BARE_NUMERIC` match starts at
  the property NAME, so the 60-character lookback landed on the *previous* declaration:
  `gap: 8, height: 44` reported `height` as a gated `gap`, and would just as happily have
  reported a real `padding` as an advisory `color`. Reading `m[1]` instead surfaced **96
  genuine findings** the gate had been mis-classifying — including 12 in the
  design-system docs, a scope that had been reporting clean for weeks.
- **`--json` was truncated when piped.** `process.exit()` does not flush a large stdout
  write to a pipe, so any consumer got a JSON document cut mid-string. Set `exitCode` and
  let the process end.

Both are the same lesson the space census recorded: *a gate that cannot fail — or that
fails on the wrong thing — is worse than no gate.*

### What is NOT enforced, and why

**No stylelint rule was added for `font-size` / `line-height` / `letter-spacing`.** It
would have needed ~40 `stylelint-disable` comments in the design-system package alone,
and a gate everyone learns to silence is not a gate — the same reasoning
`ds-linkage`'s config note gives for its advisory split. The ratchet supersedes it and
covers three forms stylelint cannot see: Tailwind arbitrary values, React style objects,
and bare numerics like `fontSize: 13`.

## Changelog freshness (enforced in CI)

The changelog at `apps/hub/src/app/design-system/resources/changelog/page.tsx`
is hand-maintained and therefore rots quietly — it once sat two months and 40
commits behind while still badged "Current". `scripts/check-changelog-freshness.mjs`
fails **Design System Quality** when a notable commit (feat / fix / perf, or
anything BREAKING) has touched `packages/design-system` or `packages/tokens`
since the newest entry and has gone unlogged past a 14-day grace window.
Commits typed `docs` / `chore` / `test` / `style` / `ci` / `build` are ignored.

- Run it locally with `npm run check:changelog`.
- `CHANGELOG_GRACE_DAYS=<n>` widens the window for a deliberate exception.
- `CHANGELOG_PATH=<file>` points it at a fixture — that is how the gate itself
  is exercised, because a check nobody has watched fail cannot be trusted.
- The CI checkout uses `fetch-depth: 0`; on a shallow clone the gate skips
  rather than reporting a false red.

## Space linkage — a ratchet over the Figma library (enforced in CI)

**Space had no gate of any kind until 2026-08-17**, while colour had six contract
tests, icons had a per-file ratchet and the web docs had `check:ds-linkage`. The
first full census of the live library shows what that cost:

| | |
|---|---|
| Spacing properties, 68 pages | **65,657** |
| "Bound" to *something* | 56,741 — **86.4 %** |
| Bound to a **correct semantic space token** | 4,568 — **6.96 %** |

The 86.4 % was the trap, and it is why nobody caught this by eye: in the inspector
every one of those properties reads as bound.

| class | before | after | what it is |
|---|---|---|---|
| `crossFamily` | **38,799** | 5,968 | a **radius/type/colour** variable bound to padding or gap |
| `tier1` | 7,286 | 7,111 | a **hidden** `ref/space` · `ref/size` primitive, which does not publish and whose code syntax `tier-discipline.test.mjs` forbids app code to write |
| `ghost` | 4,771 | 4,771 | a local variable id **no collection owns** — 19 distinct ids |
| `remote` | 1,317 | 717 | a variable imported from **another library** |
| `tier2` | 4,568 | **37,632** | correct |
| | **6.96 %** | **57.51 %** | share of all spacing on a correct token |

**The "after" column is the `ref/radius/none` rebind, same day.** Every
`ref/radius/none` binding on a spacing property, across 38 pages, was moved to
`padding/none` · `inline/none` · `stack/none` — chosen by property and layout axis
(`padding*` → padding; `itemSpacing` → inline on a HORIZONTAL frame, stack on a
VERTICAL one; `counterAxisSpacing` → the opposite axis). **Zero visual change**: all
of them resolve to 0, and the script refused to touch any property whose value was
not already 0.

Two things that pass makes worth knowing next time:

- **Mains first, then overrides.** Rebinding a main component fixes its instances —
  unless an instance carries an *explicit override*, which does not follow its main.
  Roughly 13,500 of the total were such overrides (Dropdown alone 7,098) and had to
  be corrected directly, after the mains.
- **What is left in `crossFamily` is the non-zero radius rungs** (`ref/radius/md` ·
  `xs` · `sm` · `xxs`) bound to spacing — chiefly Dropdown 2,924, Pagination 503,
  Stepper 468, List 438. Those carry real values, so each needs a space rung of
  equal value chosen for it. That is a separate job, and it is not zero-risk.

- Run it with `npm run check:space-linkage`; it also runs inside
  `npm test -w @mosje/tokens`, which **Design System Quality** already executes.
- `npm run check:space-linkage:baseline` refreshes the frozen debt.
- Debt is frozen **per page** in `packages/tokens/reference/space-bindings-baseline.json`.
  A page that regresses fails; a page that **improves** also fails, telling you to
  re-baseline in the same change — that is what stops one page's cleanup being
  silently spent on another page's regression. Never add entries to go green.
- It also asserts source invariants that need no Figma access: a semantic space
  token may only alias a `space.*` primitive, each family's rungs ascend, and no
  primitive rung is left with nothing pointing at it (`8xl`/72px is the one
  currently in that state and is frozen so it cannot be joined).
- All ten failure modes were exercised by deliberately breaking them, per the
  rule that a check nobody has watched fail cannot be trusted.

### Re-sweeping the census — the constraint is load-bearing

`reference/figma-space-bindings.json` is produced through the Figma MCP, **one page
per `use_figma` invocation, via `setCurrentPageAsync`.**

Walking several pages in one invocation — by `setCurrentPageAsync`, by
`PageNode.loadAsync`, or even after loading every page up front — returns **partial
and non-deterministic** trees. Navbar measured 2,885 bound properties per-page, then
**1,685 and 1,669** on two batched runs of *identical code*. `findAll(() => true)`
returned the same node count both ways, so the shortfall is invisible to a
node-count sanity check. A batched re-sweep under-reports and must not be committed;
`space-linkage.test.mjs` refuses a census that does not declare the method.

### The spacing ladder is VALUE-NAMED — and that is load-bearing

**The rung IS the pixel value.** `padding/16` is 16px, and so are `inline/16`, `stack/16` and
`section/16`. There is no T-shirt label anywhere in the space system, at either tier.

```
0  2  4  6  8  12  16  20  24  32  40  48  56  64  72  80      + padding 120 · 360
```

Every family carries that ladder, so no measurement is unexpressible. Two rules follow, and
`space-linkage.test.mjs` enforces both:

1. **A rung's name equals its resolved value.** A `padding/16` that resolves to 20px fails.
2. **No label carries two values across families.** This is the defect the rename removed —
   `l` used to be 16 in `inline`, 24 in `stack`, 20 in `padding` and 56 in `section`, a
   collision inherited verbatim from UX4G 3.0 (`--ux4g-inline-l`=16 beside `--ux4g-stack-l`=24).

**Do not "restore" T-shirt names.** They were removed for two measured reasons: the collision
above, and the fact that a T-shirt ramp has no slot between adjacent rungs — every insertion
renames everything above it, which happened twice in a single day before the change.

**UX4G conformance is unaffected**: the `--ux4g-*` mapping is emitted independently and never reads
these names. Since 2026-09-04 that mapping is a build artifact of `tools/ux4g-conformance/`
(`parity.generated.css`, gitignored), read only by `measure.mjs` — it is no longer shipped in
`@mosje/design-system`, because nothing in the estate ever imported it.

#### The boundary rule that keeps a value-name honest

> **Mode-varying spacing belongs in `density/*`, never in the ladder.**

A value-name lies the moment a mode changes the value. Space has ONE mode; density variance
already lives in `density/*` with its own two. If a spacing value must differ by mode it is a
density token, not a ladder rung. This is the single real trade-off of value-naming, and it is
mitigated by boundary, not by hope.

#### Scopes

The four families are scoped **`GAP` only** — Figma's `GAP` covers gap *and* padding, so
`WIDTH_HEIGHT` merely dumped 60 spacing tokens into the size picker. A width comes from
`ref/size/*`, `layout/*` or `container/*`, never from the spacing ladder.

### Per-page totals move on a library re-sync — expect one false regression

Repeated reads *within* a session are byte-identical, so the census is reproducible.
Across a **library re-sync** it is not: between the two censuses of 2026-08-17,
Navbar went 3,223 → 3,510 properties (gaining 219 `remote` bindings) and Inputs went
1,526 → 1,155 (losing 339), with no edit touching either page. Figma had re-resolved
remote instance subtrees.

So the ratchet can report a regression nobody caused. When it does: confirm no real
binding changed, then re-baseline — do not go hunting for an edit that does not exist.

**The fix worth making** is to count only **authorable** nodes (those outside any
instance). Instance descendants are derived from their main, so counting them both
double-counts *and* imports this instability — Navbar's authorable-only figures were
byte-identical across independent invocations while its totals moved. That would
change every headline number, so it is a deliberate migration, not a patch.

## Radius linkage — a ratchet over the Figma library (enforced in CI)

**Radius had no gate of any kind until 2026-08-18**, while colour had six contract tests,
spacing had its own ratchet and icons had a per-file one. Spacing was censused three times;
radius, zero. The first census shows what that cost:

| | |
|---|---|
| Radius properties, 35 of 69 pages | **92,324** (51,844 authorable) |
| Bound to a **correct Tier-2 token** | 1,488 — **2.87 %** of authorable |

| class | authorable | what it is |
|---|---|---|
| `t1` | **4,902** | a **hidden** `ref/radius/*` primitive — does not publish, and tier-discipline forbids app code writing its code syntax |
| `rn` | **5,599** | unbound, non-zero — the raw literal this gate exists to shrink |
| `rm` | 548 | a radius variable imported from **another library** (`radius-full`, `radius-md`, `radius-none`, `radius-xl`, `radius-xs`, `button-corner` — a foreign vocabulary, chiefly Sidebar 360, Stepper 232, Navbar 72) |
| `xf` | 132 | a **`Font Size/*` or `Line Heights/*` variable bound to a corner radius** |
| `gh` | **0** | no ghosts — unlike spacing, which carried 4,771 |
| `t2` | 1,488 | correct |

`rawZero` (39,175) is **not** counted as a defect: 0 is the absence of a radius, not a wrong
one — the same reasoning `ds-linkage` applies to `0px`.

**The ratchet runs on AUTHORABLE properties only** (outside any instance). This is the fix the
space rule identified and deferred: instance descendants are derived from their main, so counting
them both double-counts and imports the cross-sync instability that made Navbar's totals move by
hundreds with nobody editing. Radius was gated after that lesson, so it was built the right way
from the start.

- Run it with `npm run check:radius-linkage`; it also runs in **Design System Quality**.
- `npm run check:radius-linkage:baseline` refreshes the frozen debt; `:report` prints the summary.
- Debt is frozen **per page** in `packages/tokens/reference/radius-bindings-baseline.json`.
  A page that regresses fails; a page that **improves** also fails, telling you to re-baseline in
  the same change.
- **Coverage is itself ratcheted.** 34 of 69 pages are not yet censused. The gate fails if that
  number grows, and fails if censused + uncensused ≠ the library's page count — a page in neither
  list is how a surface goes ungated.
- All ten failure modes were exercised by deliberately breaking them.

### The radius ladder is VALUE-NAMED too — and the first call on this was wrong

**Both ladders are value-named.** `shape/8` is 8px exactly as `padding/16` is 16px. `full` is the
single named rung, a sentinel meaning *fully rounded*; **S7** asserts it is the only permitted
non-numeric rung, so a second exception cannot appear quietly.

**This reverses a decision made earlier the same day, and the reversal is the instructive part.**
The first review kept T-shirt names on two arguments:

| Argument for keeping T-shirt names | Why it does not hold |
|---|---|
| Radius has no label *collision*, so the defect that forced the spacing rename is absent | True, but that is an argument that renaming is not *urgent* — not that it is wrong |
| A T-shirt name carries a ROLE (`sm` = input, `md` = button) that a number does not | **False.** The role layer already exists at **Tier 3** — `control/radius`, `cmp/button/radius`, `cmp/card/radius`. A button binds `cmp/button/radius`, never `shape/md`. Role-naming was never Tier 2's job |

Once the second argument goes, nothing is left on that side: value-naming costs nothing, buys the
same free insertion spacing gained, and leaves **one** mental model across both ladders instead of
two. The rungs' roles are still published — in each variable's *description*, which is generated
from `SHAPE_GUIDANCE` and reaches designers in the Figma picker.

**How it was done safely**, and the two traps it confirms:

- **22 variables renamed in Figma with `codeSyntax` AND `description` rewritten in the same pass.**
  A rename updates neither; the spacing rename lost 51 codeSyntax entries exactly that way.
  Figma binds by variable **id**, so every canvas binding followed automatically — no node touched.
- **Value preservation was PROVEN before anything was rebaselined.** All 22 renames were declared
  in `RENAMES` in `visual-contract.test.mjs` and all nine assertions passed against the
  **un-regenerated** fixture — the old fixture is the evidence. Only then was it rebaselined and
  the entries retired. The library was then read back and matched the built payload at
  `77e146:25`.
- **`$description` is reference-interpolated by Style Dictionary.** A note reading *"this used to
  alias {radius.md}"* was parsed as a real token reference and failed the build with
  `control.radius.$description tries to reference radius.md`. Do not put braces in prose.
- **Two legacy alias maps keep their own key vocabulary**, values repointed only: Tailwind's
  `borderRadius` scale (`rounded-md` is Tailwind's name, not ours) and the `tokens.ts` `RADIUS`
  export (which already diverged — `pill`, not `full`). Renaming those keys would be a breaking
  change to two separate public APIs.

### Tier discipline: ONLY `shape/*` may alias a Tier-1 radius

Three **published** variables — `control/radius`, `cmp/button/radius`, `cmp/card/radius` — each
aliased `{radius.md}` directly, reaching past Tier 2 into a **hidden** primitive designers cannot
see. Figma mirrored the source faithfully, so the defect existed identically in both. Fixed
2026-08-18, in code and in Figma, **value-preservingly**: all three still resolve to 8px, and
`tokens.css` changed only two alias paths. `S5` in `radius-linkage.test.mjs` now fails the build
if any semantic-or-component token outside `shape` aliases `radius.*`.

**A re-point does not update `description` or `codeSyntax`** — the spacing rename lost 51 of them
exactly that way. Both were rewritten by hand in the same change.

### Cards are 12px, and the component token is now load-bearing

`cmp/card/radius` said **8px** while `shape/12` is the rung published as *"cards and panels"* and
`design.md` asked for 12px. Resolved 2026-08-18: the token now resolves to `shape/12`.

The more interesting half is that the token was **orphaned**. `--sa-cmp-card-radius` appeared only
in `tokens.css`; no component consumed it. `Card` drew a raw `--sa-shape-8` and `MetricCard` a raw
`--sa-shape-12` — two card surfaces already 4px apart, with a component token sitting unused that
existed precisely to stop that. Both now bind it.

**A Tier-3 token nothing binds is worse than no token**: it reads as governance while the thing it
governs drifts underneath. When adding one, bind it in the same change, or do not add it.

### The rebind campaign — 2.87 % to 97.90 %, all 69 pages, ZERO defects

**Coverage is complete: 69 of 69 pages censused, 0 uncensused.** 56,672 of 58,008 authorable
properties sit on a correct Tier-2 token.

**Every defect class is zero.** No Tier-1, no cross-family, no foreign-library, no ghost, no raw
non-zero radius anywhere in the SAMAVESH library. The per-page ratchet is therefore frozen at
zero, which is the strongest state it can be in: **any** new raw radius on **any** page now fails
the build.

What is left is 852 unbound **zeros** (Footer 620, Spacing 228, Changelog 4) and 364
`COMPONENT_SET` **chrome** properties — both declared non-defects, for reasons stated above.

**The 3px on Tables became `shape/4`**, on your call. One `setBoundVariable` fixed all four
corners: binding a single corner of a node with a *uniform* radius binds all four, so a rebind's
call count under-reports the properties it actually changes.

**The 116 fractional radii were bound to their nearest rung** — every move under 1.1px, none
visible. Two causes, established by inspection rather than assumed:

- **Popover (64) and Tabs (4) were never scaled at all.** Their boxes are integral (278×54,
  145×98); the radius was simply off-ladder at 4.8.
- **New in 2.0 (32) and Thumbnail (12) genuinely were scaled**, and their boxes are fractional.

An earlier version of this rule claimed binding these would "hide the scaling defect". That was
half wrong, and the correction is worth keeping: **Figma's scale tool bakes the corner radius as
an ABSOLUTE value**, so resizing the box does *not* restore the radius — it has to be set back
either way. The fractional *box* is a separate, cosmetic issue; the seven nodes are listed in
`fractionalBoxes` in the census so they are not rediscovered as a mystery.

The final 34 pages were censused and rebound in the same pass; each carries a `censusBefore`
block recording its state at first measurement, so the census stands on its own rather than
being retro-fitted from the result.

The rule was provable at every step, never approximate:

| Case | Bound to | Why it is exact |
|---|---|---|
| value matches a rung | that rung | identical pixels |
| value ≥ half the shorter side | `shape/full` | already renders fully rounded |
| Tier-1 binding | the Tier-2 rung of equal value | same terminal value |
| foreign / cross-family variable | resolved to its VALUE, then the rules above | same rendered pixels |
| `10` | `shape/12` | explicit decision |
| anything else | **left, and reported** | not the script's call |

Only **authorable** nodes were touched, so instances follow their mains rather than gaining new
overrides. **Every page's authorable property COUNT is asserted unchanged** before its numbers are
accepted — a rebind that moves the count has done something other than rebind.

### `shape/full` is a SENTINEL, not a measurement

`999px` means "fully rounded". Any value exceeding half the shorter side renders the same, and
999 is that for every surface in the estate. Code disagreed with itself — `999px`, `9999px` and
`50%` all appeared — so **write `var(--sa-shape-full)` and nothing else**. Note `50%` is not a
synonym: on a non-square box it gives an **ellipse** where `999px` gives a stadium.


## The Figma exporter DROPS any component root it does not recognise (found 2026-08-18)

`build/formats/figma-variables.mjs` routes every token to a Figma collection with
`collectionFor(path, tier)`. Its last line is `return null`, and a `null` means **the token is
silently omitted from the Figma export**. There is no warning, no count, no failure.

Component tokens are routed by their **component name** against a hardcoded set:

```
COLOUR_ROOTS = bg, text, icon, border, outline, overlay, focus, action,
               control, spinner, button, card, badge, chart, on, layer
```

So a component reaches Figma only if someone remembered to add its name to that list.

| | |
|---|---|
| `cmp/*` roots the **code** defines | `accessibilityBar`, `action`, `badge`, `button`, `card` |
| `cmp/*` roots that reach **Figma** | `action`, `badge`, `button`, `card` |

**`accessibilityBar` is defined in code, emits `--sa-cmp-accessibilityBar-height` into
`tokens.css`, and never reaches the library.** Fourteen component tokens in that state.

### What that cost, and why the variables that appeared are NOT vandalism

A designer hit the gap and did the reasonable thing: **hand-authored the variables in Figma**.
Ten of them, IDs `55673:*` and `55677:*` — the newest in the file.

They are identifiable with certainty because **every variable the pipeline creates carries a
`codeSyntax`, and every hand-made one has `codeSyntax: null`.** That is the cleanest authorship
signal the file has; 49 of 1,006 variables have no codeSyntax, and the other 39 are long-documented
legacy (`ref/color/*` orphans, `deprecated/type/*`).

Most of that work is **good**: names follow the grammar (`cmp/accessibilityBar/pillSize`, camelCase
segment, matching `chart/tooltipBg`), scopes are correct and narrow (`WIDTH_HEIGHT`,
`FRAME_FILL|SHAPE_FILL`), and all ten carry hand-written descriptions.

What is wrong with them is a consequence of the gap, not of carelessness:

1. **No `codeSyntax`** — a developer clicking one gets no CSS variable name, because the designer
   had no way to know the generated name.
2. **Six of ten bypass Tier 2**, aliasing a Tier-1 primitive directly — `flagHeight → ref/size/22`,
   `pillSize → ref/size/32`, `stepSize → ref/size/24`, `iconButtonSize → ref/size/28`,
   `launchIconSize → ref/size/12`, `cmp/divider/width → ref/border-width/hairline`. The same defect
   class the radius work just eliminated.
3. `hoverBg` and `pillBg` resolve through `overlay/on-brand/*`, which are **themselves** library-only,
   so the chain never reaches code at all.

### A second, older instance of the same failure

Five published Colour variables carry a `codeSyntax` naming a CSS variable **that does not exist**:
`var(--overlay-on-brand-hover)`, `var(--color-border-brand-primary-subtle)`,
`var(--color-border-neutral-inverse)`, `var(--color-border-brand-primary-hover)`. Nothing in
`tokens.css` breaks the `--sa-` prefix — these are hand-typed names that were never real. Two of
them also have an empty description.

### Fixed 2026-08-18

**`collectionFor` now routes Tier-3 by TYPE and THROWS on anything it cannot place**, naming the
token. `COLOUR_ROOTS` still runs first, so `cmp/button/radius` and `cmp/card/radius` stay in the
Color collection they already occupy — Figma refuses to move a variable between collections, so
re-routing an existing one would orphan it. The failure was exercised by feeding the build an
untyped `cmp/mysteryWidget/probe`; it fails with the token named.

**The designer's variables were reconciled, not replaced.** Nine were upserted **by name**, so
their ids, descriptions and every canvas binding survived, and each gained the `codeSyntax` it
could never have had. Two were created from code (`dividerHeight`, `dividerColor`). One was
**Figma-only and is now in code** — `iconButtonSize`, which the designer added because
`.sa-abar__icbtn` was drawn at a hardcoded `28px`. They were ahead of the code, and that literal
is now bound.

**`overlay/on-brand/*` was renamed in place to `overlay/brand/{hover,active}`**, ids preserved.
Three naming attempts were needed and each rejection taught something: `on-brand` has a hyphen
inside a segment; `onBrand` is not a `FAMILY` (they are `neutral · brand · status · link`); and
`pressed` is not a state word (the system uses `active`). The conformant name names the **surface**
family, exactly as `on/bg/brand/*` means ink *for* a brand background rather than brand-coloured
ink. Its hover value was **0.08 against a component that has always rendered 0.12** — code is now
authoritative.

**Thirteen published variables carried a `codeSyntax` naming a CSS variable that does not exist.**
Two were stale and are fixed (`layout/bar/height`, `layout/flag/width`); eleven are genuinely
library-only and had their `codeSyntax` **removed**, because a name that resolves to nothing is
worse than no name — a developer copies it and gets a silent no-op. **Zero non-conformant
`codeSyntax` remain in the file.**

Library-only gaps closed: **Space 20 → 12, Color 11 → 6.**

### The rule

**A token the code defines and the exporter cannot route is a BUG, not a filter.** `collectionFor`
must not return `null` for a `cmp/*` path; it should fail the build naming the unrouted root, the
same way a scope path that cannot be read is a hard error in `check:ds-linkage`. Until it does,
every new component silently fails to reach designers, and the designer's only recourse is to
hand-make variables that code can never consume.

**Reconcile, never duplicate.** When code and library both hold a token, upsert **by name** so the
library's id survives — a new variable with the same name orphans every node bound to the old one.
And check who is right before overwriting: here the designer's structure (aliasing `layout/bar/height`
rather than restating `46px`) was better than the code's, and their `iconButtonSize` was a token the
code was missing entirely.
