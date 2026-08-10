---
paths:
  - "packages/design-system/**"
  - "packages/config/**"
  - "packages/tokens/**"
---

# Design-system rules (`packages/design-system/` — the Figma-synced source of truth)

This package is the **single source of truth** for the visual language across all 13 sites + 20 portals, kept **100% in sync with the Figma library** via Code Connect.

**Phase 2 is underway.** Tokens are authored as DTCG JSON in `@mosje/tokens` (`packages/tokens/src/*.json`) and compiled by Style Dictionary v4 into the `--ds-*`/`--sa-*` CSS contract, a TS module, the Tailwind v3 preset (`@mosje/config`) and v4 `@theme`, and a Figma DTCG export. **Edit tokens in `packages/tokens/src/`, never in generated artifacts** (`packages/tokens/dist/`, `packages/design-system/tokens.css`, `packages/config/tailwind-preset.cjs`). Run `npm run build -w @mosje/tokens` to regenerate and `npm test -w @mosje/tokens` to assert the backward-compatible contract.

## Principles
- **Tokens first.** Define color/spacing/typography/radius as tokens (CSS variables + a TS export), named to match the Figma variables 1:1. Apps consume tokens; they never hardcode.
- **One component, one definition.** Each shared component (Button, Card, Header pieces, nav, etc.) lives here once and is imported as `@mosje/design-system`. No per-app forks.
- **Framework-agnostic where possible.** Tokens as plain CSS vars + a Tailwind preset (`packages/config`) so both Tailwind v4 (website) and v3 (portals) can consume the same values.
- **Code Connect.** Every exported component maps to its Figma component; keep mappings validated.

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
