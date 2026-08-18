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
    `actions/button.figma.ts`, `navigation/accessibility-bar.figma.ts`,
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
    `components/navigation/accessibility-bar.figma.ts` (AccessibilityBar).
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
- **`apps/docs/src/app/llms.txt/route.ts`** → served at `/design-system/llms.txt`
  — generated from `apps/docs/src/lib/nav.ts`, so it self-syncs with the portal.

**The rule:** any change to a token, a component, or a Figma sync MUST also:
1. Update `design.md` (and `AGENTS.md` if the component inventory changed) and
   bump the `Last reviewed` date in `design.md`.
2. Update the SAMAVESH portal (`apps/docs`) — the relevant foundation/component
   page **and** `apps/docs/src/lib/nav.ts` if pages were added/removed (this
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

**UX4G conformance is unaffected** and must stay that way: the `--ux4g-*` parity layer is emitted
independently and never reads these names. Renaming on our side is invisible to
`ux4g-parity.test.mjs`; if that ever stops being true, the parity layer has been wired wrong.

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

### Open design question — `cmp/card/radius` contradicts its own role

`--sa-cmp-card-radius` resolves to **8px** (`shape/md`), while `shape/lg`'s published description
reads *"cards and panels"* and `design.md` §3.B asks for 12px on cards. The token is the outlier.
The 2026-08-18 fix deliberately left the value alone: changing it moves every card in the estate,
which is a design decision, not a refactor.

### The Figma documentation page

**`Radius` — page `55623:695`**, between `Spacing` and `Motion` in the FOUNDATION run. Two
frames, matching the `Spacing` precedent exactly:

- **`Radius — Documentation`** (`55623:696`, 1680 wide) — hero + six sections: `01 Anatomy`,
  `02 Tiers`, `03 Ladder`, `04 Divergence`, `05 Measured`, `06 Do and Don't`.
- **`Radius — Component record`** (`55628:695`, 880 wide) — the sibling maintainer frame of
  **open gaps only**, forward-looking, not a catalogue of what was fixed.

**Audited at 100 % bound on every gated property** — 197 fills, 356 padding, 87 gaps, **404
radii**, 149 text nodes, all on a variable or a published style, with **zero `UNACCOUNTED`** and
zero declared specimens (nothing on the page needed one).

Two things worth knowing if you build the next one:

- **`figma.createAutoLayout()` gives every frame a default white fill.** 53 pure layout
  containers (`row`, `header`, `stat`, `meta`, `eyebrow`, `stats`, and each `rung` cell) carried
  an unbound white the audit counted as raw — 78.8 % on fills before it was found. The fix is
  `fills = []`, not a bound fill: a layout container should have **no** fill, not a correct one.
- **The hero's top padding is 80, not the 88 the house style states.** There is no `padding/88`
  on the value-named ladder, so 88 is unbindable. `Spacing` already resolved this the same way;
  `figma-documentation-style.md` records the intent, and the implemented precedent wins where a
  literal reading would force an unbound value.

**Every swatch in `03 Ladder` has its corner radius bound to the rung it demonstrates** — none is
drawn at a typed number, so the page moves when the ladder moves. That is the difference between
documentation that is correct and documentation that merely looks correct.

### `shape/full` is a SENTINEL, not a measurement

`999px` means "fully rounded". Any value exceeding half the shorter side renders the same, and
999 is that for every surface in the estate. Code disagreed with itself — `999px`, `9999px` and
`50%` all appeared — so **write `var(--sa-shape-full)` and nothing else**. Note `50%` is not a
synonym: on a non-square box it gives an **ellipse** where `999px` gives a stadium.
