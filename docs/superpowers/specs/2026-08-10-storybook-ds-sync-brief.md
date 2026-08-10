# Storybook ↔ design-system sync — **COMPLETE**

**Status: done, 10 August 2026. This is a record, not a task.**
Do not start a session from this document. The living rule is
[`.claude/rules/design-system.md`](../../../.claude/rules/design-system.md)
§ "Storybook must track the design system"; the numbers below are a snapshot
and will age.

Originally written as a hand-off brief when coverage was 10 of 69. It was
finished before anyone picked it up, so it has been rewritten to say what was
actually built rather than what was planned.

## Where it landed

| | Then (brief written) | Now |
|---|---|---|
| Components with a story | 10 / 69 (14%) | **69 / 69 (100%)** |
| Declared debt in the baseline | 59 | **0** |
| Story files | 7 | **58** |
| CI gates | 1 (coverage) | **3** (coverage · parity · smoke) |

Verify rather than trust this table — it is a snapshot:

```bash
npm run check:storybook          # coverage: does a story exist?
npm run check:storybook:parity   # parity:   is the story still true?
npm run check:storybook:smoke    # smoke:    does it actually render?
```

## The three gates, and why one was never enough

All three run in **Design System Quality**
(`.github/workflows/ds-quality.yml`).

**1. Coverage** — `scripts/check-storybook-coverage.mjs`. Every component
exported from the barrel has a story. Built as a ratchet: missing components
could be parked in `apps/storybook/coverage-baseline.json` as declared debt, and
an entry that gained a story *failed* until it was pruned — so the backlog could
only shrink. **The baseline is now empty.** It still exists, but adding entries
to it to get a build green would be reopening a closed debt.

**2. Parity** — `scripts/check-storybook-parity.mjs`. Coverage cannot see what
happens *after* a story is written. This catches a prop added that no story
mentions, and a story left behind by a rename or deletion — still documenting an
export the barrel no longer has, which is worse than a missing story because a
reviewer reads it and believes it.

**3. Smoke** — `scripts/smoke-storybook.mjs`. Mounts every story in Chromium and
fails on an uncaught error, a console error, or an empty canvas. Without it, a
story that throws still counts as coverage: the gate reports green while the
documentation is blank.

Together they answer the three separate questions "is it documented", "is the
documentation still true", and "does it render" — which is what *synced*
actually means.

## Decisions worth not re-litigating

- **Imports are not a coverage signal.** A story that imports `Button` to sit
  beside what it demonstrates does not document `Button`. Counting imports would
  let coverage drift upward on its own. Multi-component files declare their
  scope explicitly with `@covers A, B, C`.
- **Escape hatches need a written reason.** `NOT_COMPONENTS` for things that
  genuinely cannot have a story (context providers, the CDN-loaded UX4G widget);
  `DOCUMENTED_BY` for sub-parts shown inside a parent's story
  (`CardHeader` → `Card`).
- **Playwright over `@storybook/test-runner`** for the smoke test — the repo
  already pins Playwright for e2e, and the alternative adds Jest plus a second
  Playwright for what is one page visit per story.
- **Storybook ships inside the hub**, built by the `apps/hub` prebuild into
  `public/storybook` and served behind the site gate at `/storybook`. There is
  no separate Vercel project, deliberately: a separate origin is a public URL
  nothing can gate. Do not add one back.

## Traps that cost real time here

- **`apps/hub/public/storybook` is generated and gitignored.** Built by the
  prebuild. Never commit it, never hand-edit it.
- **Local and production resolve `/storybook` by different rules**: the static
  build if it exists (both), else the `:6006` proxy in dev, else the "app not
  running" page in production. Change that logic in `apps/hub/next.config.ts`
  and you must test all three — including moving `public/storybook` aside to
  exercise the fallback.
- **`.vercelignore` once excluded `/apps/storybook/`**, so the source was never
  uploaded and the build failed with "no storybook bin found" while the package
  counts (899 against a 1150-entry lockfile) quietly said why. Four deploys were
  spent on symptoms before the cause.
- **While authoring, the static build wins at `/storybook` and does not
  hot-reload.** Use `npm run dev:storybook` and `localhost:6006` directly.

## If you are here to add a component

The story is part of the change, in the same commit — like `design.md` and the
changelog. `.claude/rules/design-system.md` has the current rule and the
conventions for writing one; `Alert.stories.tsx` and `Controls.stories.tsx` are
the reference examples.
