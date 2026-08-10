# Task brief — bring Storybook to full parity with the design system

**Copy everything below the line into a fresh session.** It is written to stand
alone; it assumes no memory of the session that produced it.

---

## Goal

`apps/storybook` must document **every** component the design system exports,
and must stay that way without anyone remembering to.

Half of that already exists. A CI ratchet (added 2026-08-10, commit `0dd76ff`)
blocks *new* drift. Your job is the other half: **burn down the 59 components of
declared backlog**, and strengthen the automation so parity survives changes
nobody thinks to check — prop changes, renames, deletions.

## Where things stand

- **10 of 69** exported components have a story (14%). 27 story entries across
  7 component files + 2 foundations files.
- **59 components are declared debt** in `apps/storybook/coverage-baseline.json`.
- Storybook is built into the hub at deploy time (`apps/hub` prebuild →
  `public/storybook`) and served behind the site gate at `/storybook`. There is
  no separate Vercel project. Do not add one.
- Live: https://mosje-samavesh.vercel.app/storybook/ (behind the review password)

### The existing gate — read it before changing anything

`scripts/check-storybook-coverage.mjs`, run by `npm run check:storybook` and by
the **Design System Quality** workflow.

It is a *ratchet*:

- an exported component with no story fails the build…
- …unless `coverage-baseline.json` lists it as pre-existing debt
- **a baseline entry that now HAS a story also fails**, forcing you to prune it

So coverage cannot regress. After writing stories, run
`npm run check:storybook:baseline` to prune, and commit the updated baseline.

Coverage signals, in order: the `component:` field of the default export; an
explicit `@covers A, B, C` comment for a file documenting several components;
the filename. **Imports are deliberately not a signal** — a story that imports
`Button` to sit beside what it demonstrates does not document `Button`. Do not
"fix" this; it is what stops coverage drifting upward on its own.

Two escape hatches, both requiring a written reason:
`NOT_COMPONENTS` (cannot have a story — providers, the CDN-loaded UX4G widget)
and `DOCUMENTED_BY` (sub-parts shown inside a parent's story, e.g. `CardHeader`
inside `Card`).

## Part 1 — write the 59 missing stories

Work in batches by category, committing each batch. Verify every batch renders
before moving on: a story that satisfies the counter but throws in the canvas is
worse than no story, because the gate then reports green.

**Forms** — Input, Select, Search, Chip, Label, FormSection, FormCard, Wizard,
MediaUpload, MediaGalleryInput, GeoPhotoInput, DeclarationCheckbox, AadhaarInput,
OtpInput, PanInput

**Feedback** — Modal, SideSheet, Lightbox, Stepper, Tooltip, Skeleton, Loader,
EmptyState, SlaProgressIndicator

**Data display** — DataTable, MetricCard, Avatar, ApprovalTimeline, SectionTitle

**Charts** — PieChart, DonutChart, BarChart, LineChart, AreaChart, Sparkline,
Gauge, Progress, FunnelChart, ScatterChart, Heatmap, ComboChart, IndiaMap,
Legend

**Dashboard** — ChartCard, DashboardGrid, KpiRow, FilterBar, SegmentedControl

**Navigation / chrome** — Tabs, SidebarNav, SiteHeader, Footer, AppSwitcher,
BrandLockup, AccountMenu, Icon, ColorModeSwitcher, DemoFab, PortalLoginShell

### What a good story looks like here

Follow `apps/storybook/stories/Alert.stories.tsx` and `Controls.stories.tsx`.

- **Read the component's props interface first.** Several take required
  controlled props (`Checkbox`/`Radio`/`Toggle` need `checked` + `onChange`;
  `Radio` also needs `name` + `value`). Guessing produces stories that render
  empty or throw.
- **Use real MoSJE content** — scheme names, districts, beneficiary counts. Not
  "Lorem ipsum", not "Foo/Bar". Reviewers judge the component by what it holds.
- A `Playground` story with `argTypes` controls, then focused stories for the
  states that carry meaning (statuses, sizes, invalid, disabled, empty).
- The doc comment says **when to use it and when not to** — the distinction that
  saves someone choosing wrong. Not a restatement of the prop table.
- Group related controls in one file with `@covers` where seeing them together
  is the point.

### Verify each batch

```bash
npm run build:storybook --prefix apps/hub   # must succeed
npm run check:storybook                     # will list baseline entries to prune
npm run check:storybook:baseline            # prune them
```

Then open the stories and confirm they render. Locally:

```bash
npm run dev:storybook      # localhost:6006, hot reload — best for authoring
```

Or through the hub at `localhost:3007/storybook/` after
`npm run build:storybook --prefix apps/hub` (the static build takes precedence
there and only refreshes when rebuilt — a real trap while authoring).

## Part 2 — make parity survive change, not just addition

The current gate only asks *"does a story exist?"*. That misses three ways
Storybook silently goes stale. Close them:

1. **A prop is added and no story exercises it.** Compare each component's
   exported props interface against the `argTypes` / usage in its story; fail
   on props no story mentions. Requires parsing the `.d.ts` or the source
   interface — pick one and be consistent.
2. **A component is renamed or deleted and its story lingers**, documenting
   something that no longer exists. Fail when a story references an export the
   barrel no longer has.
3. **A story renders but is broken.** A smoke test that mounts every story and
   fails on a thrown error or an empty canvas. Storybook's test-runner is the
   obvious route; check whether it can run in this CI without adding heavy
   dependencies before committing to it.

Wire whatever you add into `.github/workflows/ds-quality.yml` next to the
existing step, and **prove each new check fails when it should** — introduce the
fault deliberately, watch it go red, then fix it. A check nobody has seen fail
is indistinguishable from one that cannot.

## Part 3 — write the rule down

Update, in the same commit as the behaviour:

- `.claude/rules/design-system.md` — the "Storybook must track the design
  system" section
- `packages/design-system/AGENTS.md` — the "Before you finish" checklist
- `apps/hub/src/app/design-system/resources/changelog/page.tsx` — a changelog
  entry (a separate CI gate enforces this for `packages/design-system` and
  `packages/tokens` changes; `npm run check:changelog`)

## Repo conventions you must follow

Read `CLAUDE.md` and `.claude/rules/design-system.md` first. The ones that bite:

- **TypeScript strict, no `any`.** Named exports.
- **Tokens, never hardcoded values.** No raw hex/px in stories; use `--ds-*`.
- **Noto Sans only** (DBIM standard). Material Symbols Rounded via `<Icon>`.
- **Never edit generated files** — `packages/tokens/dist/*`,
  `packages/design-system/tokens.css`, `apps/hub/public/storybook/*`.
- **No AI attribution in commit messages.** No `Co-Authored-By`.
- A `.claude/hooks/guard.sh` PreToolUse hook blocks `rm -rf` and force-push.

## Before you finish

```bash
npm run check:storybook            # 69/69, baseline empty
npm run check:changelog
npm test                           # design-system + hub
npm run typecheck --workspace @mosje/hub
npm run lint --workspace @mosje/hub
npm run build --workspace @mosje/hub
```

Then verify in production, not just locally — the two have diverged before.
Push to `main` (GitHub is connected to Vercel; pushing deploys automatically),
wait for the deploy to report Ready, and confirm
https://mosje-samavesh.vercel.app/storybook/ renders the new stories.

## Two traps that have already cost time here

- **`apps/hub/public/storybook` is generated and gitignored.** It is built by
  the hub's prebuild. Never commit it, never hand-edit it.
- **Local and production resolve `/storybook` differently.** Static build if it
  exists (both), else the `:6006` proxy in dev, else the "app not running" page
  in production. If you change that logic in `apps/hub/next.config.ts`, test all
  three paths — including moving `public/storybook` aside to check the fallback.

## Definition of done

- `npm run check:storybook` reports **69/69** and `coverage-baseline.json`'s
  `missing` array is empty.
- Every story renders, verified by eye or by an automated smoke test.
- At least one new check from Part 2 is in CI and has been *seen* to fail.
- The rule is documented in all three places above.
- Verified live at https://mosje-samavesh.vercel.app/storybook/.
