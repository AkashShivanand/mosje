# MoSJE — Project Brain (all agents, all tools)

> **This file is the cross-tool entry point.** Claude Code, Codex, Antigravity,
> Cursor, Gemini, Copilot, Aider — and humans — start here. Every tool-specific
> file in this repo (`CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`,
> `.cursor/rules/`) points back to this one, so the guardrails are the same
> whoever is at the keyboard.
>
> **Detail lives in `.claude/rules/*.md`** — indexed below with paths. Those files
> are plain markdown: the directory is named for the tool that auto-loads them,
> but **any agent can and should open them**. They are the canonical bodies;
> nothing here restates them at length, so the two cannot drift.

## The four non-negotiables

Everything else is craft. These four are gates.

1. **Never commit to `main`.** Every task gets its own branch and reaches `main`
   through a PR. `.husky/pre-commit` refuses commits on `main` — it will stop you
   whatever tool you are.
2. **A task keeps its branch across sessions.** Before your first edit, find out
   whether this work already has a branch and continue on it. → *Branch procedure*
   below; full rule in `.claude/rules/branch-continuity.md`.
3. **Accessibility is not tradeable.** WCAG 2.2 AA + GIGW. Semantic HTML, alt text,
   keyboard nav, visible focus, AA contrast, on every public-facing page.
4. **Design tokens, never hardcoded values.** No raw hex, `rgb()`, or arbitrary px
   in component CSS or Tailwind classes. `npm run lint:css` blocks them.

## Branch procedure — run this before your first edit

```bash
npm run branches          # current branch · dirty count · worktrees · branches · PR state
```

Then decide:

| The inventory shows | Do |
|---|---|
| A branch related to this task, PR **open** or none | **Use it.** Continue there. |
| A related branch, PR **merged or closed** | **Branch fresh from `main`.** Never continue a landed branch. |
| Nothing related | Create `<type>/<short-slug>` — `feat/ fix/ ds/ docs/ chore/`. |
| Two or more plausible candidates | **Ask.** Guessing splits one task across two branches. |

State the branch and your evidence in your first response.

**Two things make switching unsafe here — check both before `git switch`:**

- **A dirty tree is a stop.** Uncommitted changes follow you onto the wrong branch,
  and they may be another session's. Do not stash, commit, or switch them away.
- **A branch checked out in another worktree cannot be checked out again.** Git
  refuses, correctly. Do not force it and do not delete the worktree or branch —
  it may hold uncommitted work.

Either case, take a worktree instead:

```bash
git worktree add ../wt-<slug> <existing-branch>        # resume
git worktree add ../wt-<slug> -b <type>/<slug> main    # start fresh
```

Resuming a branch? Sync first: `git fetch origin && git merge origin/main`.
**Merge, never rebase** on this repo — see `CLAUDE.md` → Branching & merging.

## Gates you must pass (tool-agnostic)

These run for everyone. Run them before you claim work is done.

| Command | What it gates |
|---|---|
| `npm run check` | 11 chained gates: hub typecheck, dangling vars, docs links, Figma docs, docs data, DS linkage, icon scale, space/radius linkage, Code Connect, chrome |
| `npm run lint` | Hub lint |
| `npm run lint:css` | **Blocks hardcoded colours** — the token mandate, enforced |
| `npm test -w @mosje/tokens` | Token contract |

Enforced automatically, regardless of tool:

- `.husky/pre-commit` — refuses commits on `main`; warns if the branch is already
  merged; runs lint-staged
- `.husky/commit-msg` — strips AI co-author / "Generated with" trailers
- `.husky/pre-push` — typechecks the hub before anything reaches `main`
- CI (`.github/workflows/apps-ci.yml`, `ds-quality.yml`) — the full suite on every PR

Husky installs via `prepare` on `npm install`. **If you cloned and did not install,
the hooks are not active** — run `npm install` before committing.

**A red PR may not be your fault.** Nothing blocks a red `main` here: `pre-push`
only typechecks *local* pushes and PR merges land server-side, while CI reports but
cannot block (branch protection needs GitHub Pro on a private repo). So `main` can
go red and stay red — it did for three days in August 2026, twenty consecutive
runs, unnoticed. `npm run branches` now says so outright. Before debugging a failing
PR, check whether `main` was already failing:

```bash
gh run list --branch main --workflow "Apps CI" --limit 5
```

## What this is

Digital estate for the **Ministry / Department of Social Justice & Empowerment
(DoSJE), Government of India**. Two parts:

1. **The Website** (`apps/hub/src/app/website/`) — one unified informational site
   consolidating 13 legacy websites. Built and live. Public, content-driven.
2. **The Portals** (`apps/hub/src/app/portals/<slug>/`) — 20 workflow portals
   covering 33+ organisations & schemes (SMILE, PM-AJAY, NOS, NSFDC, NMBA, …).
   Authenticated, transactional.

**North-star:** everything renders from one shared design system
(`packages/design-system/`) kept in sync with a Figma library.

## Structure

```
mosje/                      # single git repo
├── apps/
│   ├── hub/                # THE WHOLE ESTATE (Next 16, React 19, Tailwind v4, Noto Sans)
│   │   └── src/app/        #   website/ · design-system/ · portals/<slug> · reports/<slug>
│   └── storybook/          # story authoring only; the hub compiles it to /storybook
├── packages/
│   ├── tokens/             # @mosje/tokens — DTCG → Style Dictionary
│   ├── design-system/      # @mosje/design-system — shared UI (90+ components)
│   └── config/             # @mosje/config — tailwind / eslint / tsconfig presets
├── docs/                   # specs, plans, research, compliance, guidelines
├── scripts/                # tool-agnostic repo scripts (branch-inventory.sh …)
└── .claude/rules/          # the canonical rule bodies — readable by ANY agent
```

`npm run dev` at the repo root boots **one** process — the hub, which is the whole
estate, Storybook included, on **port 3007**. There is no per-portal dev server.

## Conventions

- **TypeScript strict, no `any`.** Named exports. PascalCase components, camelCase utils.
- **Design-system-first.** Before writing UI: list the elements, check
  `packages/design-system/index.ts` and `design.md`, import what exists, and add
  what is missing **to the DS first**. Document the audit inline.
- **Noto Sans** everywhere. **National Emblem** for logo/favicon — never an invented mark.
- `next/image` for images; `<Icon>` from `@mosje/design-system` for icons
  (Material Symbols Rounded, weight 300, size 24).
- **Real content, real assets** — no lorem/placeholder in production pages.
- Mobile-first responsive; content max-width **1280px**.
- **No Indian tricolour band/stripe motif** in UI chrome unless explicitly asked.
- **Visual audit is mandatory** — screenshot and audit every component/page change
  before declaring it complete. Lint and typecheck passing is not sufficient.
- **Commit messages carry no AI attribution.** No `Co-Authored-By: Claude`, no
  "Generated with Claude Code". `.husky/commit-msg` strips them as a backstop.

## Safety rules (learned the hard way)

- **macOS is case-insensitive.** `Portals` and `portals` are the SAME directory.
- **Moves are non-destructive; deletes are not.** Prefer `mv`, or
  copy-verify-then-`rmdir`. Never recursively delete project content without
  explicit human confirmation.
- **Never `git add -A` or `git commit -a`. Stage explicit paths.** Sessions share
  this working tree; a blanket add once swept 15 files of a parallel session's work
  into an unrelated commit. Read `git status` before staging — files you do not
  recognise are somebody else's work.
- Don't touch or commit `Incoming/` (21 GB of raw source).
- **Never read or commit `.env*` files or secrets.**

## The rule set — canonical bodies

Open the file when you touch its area. Plain markdown; any tool can read them.

| Rule | When it applies |
|---|---|
| `.claude/rules/branch-continuity.md` | **Every session, before the first edit** |
| `.claude/rules/accessibility-entry-point.md` | The accessibility bar / UX4G widget |
| `.claude/rules/standards-precedence.md` | Any conflict between quality and a standard |
| `.claude/rules/guidelines.md` | GIGW 3.0 · DBIM 3.0 · UX4G — the government standards |
| `.claude/rules/design-system.md` | Building or changing shared UI |
| `.claude/rules/design-system-architecture.md` | Component architecture, composition, tokens |
| `.claude/rules/component-authoring.md` | Authoring a component in Figma **and** code |
| `.claude/rules/documentation-ds-linkage.md` | Documentation pages — the strictest binding rules |
| `.claude/rules/figma-documentation-style.md` · `figma-code-sync.md` | Figma work and Code Connect |
| `.claude/rules/figma-library-index.md` | **Adding, renaming, splitting or retiring a Figma library page** — gated by `npm run check:figma-index` |
| `.claude/rules/design-audit.md` | Auditing visual work |
| `.claude/rules/portals.md` · `portal-appswitcher.md` · `portal-login-demos.md` | Portal work |
| `.claude/rules/website.md` | The public website |
| `.claude/rules/live-data-fallback.md` | Any page showing figures from a live API |
| `.claude/rules/prototype-data-modes.md` | Dashboards that mix live and illustrative figures |
| `.claude/rules/hub-integration.md` | Mounting an app into the hub |

Deeper context: `MOSJE-ARCHITECTURE.md` (structure map),
`packages/design-system/design.md` (the AI design contract),
`docs/guidelines/README.md` (government standards),
`CLAUDE.md` (the Claude-flavoured superset of this file).

## Honest limits

Instruction files are **advisory for every agent, including Claude** — a model can
skip them. Only `.husky/*` and CI actually block. So when you add a guardrail,
push it as far down as it will go: a git hook or a CI gate binds every tool and
every human; a paragraph binds whoever reads it. Prefer the gate; write the
paragraph to explain *why* the gate exists.
