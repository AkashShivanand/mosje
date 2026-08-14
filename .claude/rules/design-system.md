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
  - **Correction, 2026-08-14:** the "zero `*.figma.ts(x)` files" half of this bullet is
    no longer accurate. `packages/design-system/figma.config.json` and a Button template
    (`components/actions/button.figma.ts`) landed with the foundation-documentation
    work, because `component-authoring.md` §12a makes the template part of shipping a
    component. **Treat them as authored-in-anticipation** — the standing warning applies:
    an unpublishable mapping reads as a finished integration, so do not infer from their
    presence that Code Connect works. `*.figma.ts` must stay excluded from the package
    tsconfig, or `npm run typecheck` fails on the virtual `figma` import.
- **What syncs code ↔ Figma today, in the absence of Code Connect:** tokens via
  `@mosje/tokens` (DTCG → Style Dictionary), and — on the Iconography page — the size
  scale and the 223-icon catalogue, both **generated** from their sources rather than
  hand-kept. Everything else is manual and therefore drifts; prefer generating a fact
  over transcribing it, because transcription is what the 2026-08-12 audit caught.

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
