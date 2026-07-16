# MoSJE Digital Estate — SAMAVESH Design System

Workspace for the **Ministry / Department of Social Justice & Empowerment (DoSJE), Government of India** digital estate, and home of the **SAMAVESH Design System** (समावेश — *"inclusion"*) — the shared, accessible, multi-script design language for the ministry's 13 unified-website domains and 20+ functional portals.

## What's in this repo

One repo for the whole MoSJE estate: the apps **and** the shared design-system program.

```
apps/
├── hub/             THE app — single origin :3000, serves the whole estate (Next 16 · Tailwind v4)
│   └── src/app/
│       ├── website/          the unified DoSJE website
│       ├── design-system/    SAMAVESH DS documentation
│       ├── portals/<slug>/   scw · nmba · nhapoa · tg · smile-admin · pm-ajay · eutthan-admin
│       └── reports/<slug>/   design-QC / audit reports
└── storybook/       component workshop (`npm run dev:storybook`) — the only non-hub process
packages/
├── tokens/          @mosje/tokens         — DTCG token source → Style Dictionary → CSS/TS/Tailwind/Figma
├── design-system/   @mosje/design-system  — shared React components (consumes generated tokens)
└── config/          @mosje/config         — Tailwind / eslint / tsconfig presets
docs/
├── superpowers/specs/   — design specs (start here: SAMAVESH program design)
├── superpowers/plans/   — implementation plans
├── research/            — Figma↔code reconciliation, DS benchmarking
└── source-brd/          — source BRDs / audits (PDFs)
.claude/                 — workspace agents, commands, rules, hooks, skills
```

> Formerly two independent app repos (dosje, smile-admin) were consolidated here; their
> original histories are preserved in gitignored `_backups/`.

## Key documents

- **Program design (the constitution):** [`docs/superpowers/specs/2026-06-07-samavesh-design-system-design.md`](docs/superpowers/specs/2026-06-07-samavesh-design-system-design.md)
- **Architecture & build registry:** [`MOSJE-ARCHITECTURE.md`](MOSJE-ARCHITECTURE.md)
- **Working conventions:** [`CLAUDE.md`](CLAUDE.md)

## Design tokens

`@mosje/tokens` is the single source of truth. Edit DTCG JSON in `packages/tokens/src/*.json` and run:

```bash
npm install
npm run build -w @mosje/tokens   # regenerate CSS / TS / Tailwind / Figma outputs
npm test  -w @mosje/tokens       # assert the backward-compatible token contract
```

Never hand-edit generated `dist/` artifacts.

## Workspace tooling (`.claude/`)

This repo ships its own Claude Code workspace — a set of **skills, slash commands, subagents, path-scoped rules, a safety hook, and a dev-server map** that encode how we build the MoSJE estate. This section is the **authoritative, self-contained index** of all of it. The per-folder docs (e.g. [`.claude/skills/README.md`](.claude/skills/README.md)) remain the detailed source for each item; this table set is the superset you can read without opening anything else.

```
.claude/
├── skills/        project skills (loaded on /<name> or auto-matched on description)
├── commands/      slash commands (/<name> — scripted, repeatable workflows)
├── agents/        subagents (specialist reviewers dispatched via the Agent tool)
├── rules/         path-scoped conventions (auto-applied when editing matching files)
├── hooks/         guard.sh / guard.mjs — PreToolUse safety net for Bash
├── settings.json  model, permissions (allow/deny), hook wiring
└── launch.json    dev-server + port map for every app
```

### Skills (`.claude/skills/`)

Situational instruction sets Claude loads automatically (matched on their `description`) or on demand via `/<name>`. Full index + authoring guide: [`.claude/skills/README.md`](.claude/skills/README.md).

| Skill | What it does | Invoke |
|---|---|---|
| **`gov-compliance`** | Apply or audit Government of India web standards — **DBIM** + **GIGW 3.0** + **UX4G** — for any page/component/portal. *Building* mode gives compliance-by-construction guidance; *Auditing* mode returns a PASS/FAIL/N/A scorecard with `file:line` evidence and a fix list. | `/gov-compliance` or auto on UI work |
| **`figma-page-organiser`** | Tidy a messy Figma handoff page into the MoSJE house convention — numbered grey portal `SECTION`s, `Role / Screen / State` frame names, sections hugged to content (the way E-Utthan & SCW were done). | `/figma-page-organiser` |

**External skills the project relies on** (not authored here):

- **`clone-website`** (global) — reverse-engineers a legacy page and rebuilds it faithfully; how the website/portal replicas grow. `/clone-website <url>`.
- **`design-qc`** (global) — **Figma ↔ live audit.** Compares a Figma design's tokens/specs against the live (or built) page's *computed CSS* (not pixel diffing) and audits the functional half too (links, forms, a11y). Produces an `audit-master.json` → QC report PDF + Figma annotation boards. **This is the tool used for the E-Utthan and SAMAVESH-login design QC** (`docs/qc/portals/eutthan-admin/`, `docs/qc/samavesh/`). *Don't confuse it with the project `/qa` command, which is build-vs-live screenshot QA, not Figma-vs-live.*
- Figma plugin skills — **`figma-use`** (mandatory before any `use_figma` call), **`figma-generate-design`**, **`figma-generate-library`**, **`figma-code-connect`**.

### Commands (`.claude/commands/`)

Scripted, repeatable workflows invoked as `/<name> <args>`.

| Command | What it does | Arguments |
|---|---|---|
| **`/a11y`** | Run a WCAG 2.1 AA + GIGW accessibility audit on a page or component (delegates to the `accessibility-auditor` agent). | `<path to page/component>` |
| **`/review`** | Review the current diff for correctness, security, and design-system consistency using the specialist agents. | `[app dir, e.g. dosje]` |
| **`/qa`** | Visual QA — diff a built page against its **live original** at desktop and mobile widths (drives Chrome). Clone-fidelity check. *For a Figma-vs-live audit, use the `design-qc` skill above, not this.* | `<live-url> [local-url]` |
| **`/new-portal`** | Scaffold a new functional portal under `apps/portals/` on the shared MoSJE stack and design language. | `<portal-slug> ["Display Name"]` |
| **`/sync-figma`** | Sync design tokens between the Figma UX4G DS and `@mosje/tokens` (DTCG → Style Dictionary). | `[figma-file-url]` (defaults to UX4G DS) |

### Agents (`.claude/agents/`)

Specialist subagents (all on `claude-sonnet`, read-only tools: Read/Grep/Glob/Bash) dispatched via the Agent tool — usually by a command above, or directly when you need one perspective.

| Agent | Role |
|---|---|
| **`accessibility-auditor`** | Audits pages/components for WCAG 2.1 AA + GIGW. Run **before shipping any public-facing page** — accessibility is a legal/compliance requirement for government sites. |
| **`code-reviewer`** | Reviews changed code for correctness, security, and MoSJE conventions before it ships. |
| **`design-system-guardian`** | Enforces design-system consistency — brand tokens over hardcoded values, Noto Sans, shadcn primitives, imports from `@mosje/design-system` over per-app forks. Catches drift. |
| **`debugger`** | Roots out the cause of a bug, build failure, or unexpected behaviour using systematic, evidence-based debugging. |

### Path-scoped rules (`.claude/rules/`)

Conventions that auto-apply whenever Claude edits a file matching their `paths` glob — so the right standards load without being asked.

| Rule | Applies to | Enforces |
|---|---|---|
| **`website.md`** | `dosje/**` | Next.js 16 · React 19 · Tailwind **v4** · shadcn · Noto Sans. Server components by default; brand tokens never literals; `next/image`; WCAG 2.1 AA + GIGW; growth via `clone-website` + `/qa`. |
| **`portals.md`** | `portals/**` | Next.js 15 · Tailwind **v3** · Radix/shadcn. Own dev port per portal; same brand tokens; **validate all input (Zod), never inline secrets, never log PII**; auth is first-class. |
| **`design-system.md`** | `packages/**` | Tokens authored as DTCG JSON in `@mosje/tokens` (never edit generated artifacts); one component per definition; Code Connect mappings kept valid; the **three AI-context artifacts** (`design.md`, `AGENTS.md`, `llms.txt`) kept in lockstep with tokens/components/Figma. |

### Safety — the guard hook & permissions

A `PreToolUse(Bash)` hook (`.claude/hooks/guard.sh` → `guard.mjs`) is the workspace's safety net — **born from a real incident where `rm -rf` on a case-folded directory wiped an app.** Exit code `2` blocks the command. It blocks: recursive deletes (`rm -r` / `rm -rf`), `git push --force` (without `--force-with-lease`), `git clean -f`, `git reset --hard`, `find … -delete`, `dd … of=`, redirects to raw disk devices, reads of `.env*` files, and fork bombs. Run any of these manually and deliberately if truly needed.

[`.claude/settings.json`](.claude/settings.json) backs this with an **allow-list** (npm/node/tsc, read-only git + `git add`/`commit`, `gh issue`/`pr`, a few doc domains for WebFetch) and a **deny-list** (reading `.env*`/`*.pem`/`id_rsa*`, plus the destructive git/`rm` commands above). A `.husky/commit-msg` hook strips any AI co-author / "Generated with" trailer as a backstop — **don't write AI attribution into commits in the first place.**

### Dev servers & ports (`.claude/launch.json`)

`npm run dev` from the repo root boots the **four** processes that exist — hub, dosje, docs and
Storybook — behind the hub gate at **:3000**.

| App | Port | Standalone script | Reached at |
|---|---|---|---|
| `apps/hub` (**the entire estate**) | **3000** | `npm run dev:hub` | `/`, `/website`, `/design-system`, `/portals/<slug>`, `/reports/<slug>` |
| `apps/storybook` | **6006** | `npm run dev:storybook` | `/storybook` (proxied — the only remaining zone) |

**The estate is single-origin: one Next app serves everything.** Every portal (scw, nmba, nhapoa,
tg, smile-admin, pm-ajay, eutthan-admin), the website, and the SAMAVESH docs are **native route
groups inside the hub** — under `apps/hub/src/app/portals/<slug>`, `apps/hub/src/app/website` and
`apps/hub/src/app/design-system` respectively — all served by `dev:hub` on :3000. There are no
`412x` portal ports and no `:3001`/`:3002` zones; `apps/dosje` and `apps/docs` no longer exist as
apps. The old `dev:website` / `dev:docs` / `dev:smile` / `dev:pm-ajay` / `dev:eutthan` scripts are
gone. Storybook remains a separate process only because it is not a Next app.

**Adding a new portal:** create the route group under `apps/hub/src/app/portals/<slug>`, not a new
app — follow [`apps/hub/src/app/portals/MIGRATION-RECIPE.md`](apps/hub/src/app/portals/MIGRATION-RECIPE.md).
See [`CLAUDE.md`](CLAUDE.md) for the full command list and [`MOSJE-ARCHITECTURE.md`](MOSJE-ARCHITECTURE.md) for the app registry.

## Principles

Accessibility-first (WCAG 2.2 AA + GIGW), multi-script (Indic + Latin) from line one, progressive enhancement, design tokens never hardcoded, and one shared system across every property.
