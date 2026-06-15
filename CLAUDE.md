# MoSJE — Project Brain

## Task Summary Rule (MANDATORY — applies to every task in every conversation)

After completing **any task** — no matter how small — always end your response with a short, plain-English summary using this format:

**What I did:** One or two sentences explaining what was changed or built.
**What's working:** What the user can now do or see.
**What's next / Recommendations:** Any follow-up steps, things still pending, or things the user should know.

Write it in simple, non-technical language. Avoid jargon. Imagine you are explaining to someone who didn't watch you work. This section always appears last in every response.

> Loaded every session. The single source of truth for how we work in this workspace.
> Scoped, path-specific rules live in `.claude/rules/`; the full structure map lives in `MOSJE-ARCHITECTURE.md`.

## What this is

Digital estate for the **Ministry / Department of Social Justice & Empowerment (DoSJE), Government of India**. It has **two parts**:

1. **The Website** (`apps/dosje/`) — one **unified informational site** that consolidates **13 legacy websites** (the department + its commissions/bodies) into a single portal. This is built and live. Public-facing, content-driven, DBIM/GIGW-compliant.
2. **The Portals** (`apps/portals/`) — **20 functional workflow portals** covering **33+ organisations & schemes** under MoSJE (SMILE, PM-AJAY, NOS, scholarships, NSFDC/NSKFDC/NBCFDC, NMBA, etc.). Authenticated, transactional apps.

**North-star:** every site and portal renders from **one shared design system** (`packages/design-system/`) that stays **100% in sync with a Figma library** via Code Connect. We will build all 13 + 20 incrementally on this shared system.

## Structure

```
mosje/                      # single git repo (was mosje-estate; apps now consolidated in)
├── apps/
│   ├── dosje/              # THE unified website (Next 16, React 19, Tailwind v4, shadcn, Noto Sans)
│   ├── portals/            # functional portals (smile-admin, pm-ajay, nos, … as built)
│   └── docs/               # SAMAVESH Storybook / DS documentation portal (Plan 3)
├── packages/
│   ├── tokens/             # @mosje/tokens — DTCG source → Style Dictionary (CSS/TS/Tailwind/Figma)
│   ├── design-system/      # @mosje/design-system — shared UI (consumes generated tokens)
│   └── config/             # @mosje/config — shared tailwind / eslint / tsconfig presets
├── docs/                   # specs, plans, research, compliance, source-brd/ (BRDs/audits)
├── Assets/                 # brand assets (SAMAVESH logo, emblems)
├── Designs/                # large .fig handoff exports — gitignored
├── Incoming/               # raw drops (zips, event photos) — large, gitignored
├── _backups/               # git-history backups of absorbed sub-repos — gitignored
└── .claude/                # this configuration (agents, commands, hooks, rules, skills)
```

This is now a **single git repo** (`mosje`). The former independent app repos (dosje had local-only history; smile-admin pushed to `smile-admin-portal`) are absorbed; their full histories are preserved in gitignored `_backups/` and the archived GitHub repo.

Apps are **independent** (own git, own deps) — this is a "monorepo-ready" layout, not yet an npm workspace. See `MOSJE-ARCHITECTURE.md` for the full app registry.

## Per-app stack

| App | Framework | Styling | Notes |
|-----|-----------|---------|-------|
| `apps/dosje/` | Next.js 16 · React 19 · TS strict | Tailwind **v4** + shadcn | Noto Sans, gov brand tokens in `src/app/globals.css`. **Next 16 has breaking changes — see `apps/dosje/AGENTS.md`.** |
| `apps/hub/` | Next.js 16 · React 19 · TS strict | Tailwind **v4** + shadcn | Root zone at :3000; mounts all child apps. |
| `apps/portals/smile-admin/` | Next.js 15 · React 19 | Tailwind **v3** + Radix/shadcn | ESLint v8 (`.eslintrc` format). Plan migration to Tailwind v4 + ESLint v9 in same sprint as Next.js version alignment. |
| `apps/portals/pm-ajay/` | Next.js 15 · React 19 | **No Tailwind** (intentional) | MIS dashboard uses hand-rolled SVG charts and `--ds-*` CSS custom properties directly. No `tailwindcss` dep by design — adding one would require configuring PostCSS and aligning to v3/v4. ESLint v8. |

**Tailwind version split (INFRA-004):** hub and dosje use Tailwind **v4** (CSS-first `@theme` config, incompatible API). smile-admin uses Tailwind **v3** (`tailwind.config.ts`). pm-ajay uses no Tailwind. Shared `@mosje/tokens` emits both a v4 `@theme` block and a v3 `tailwind-preset.cjs` so either consumer can pick up the token contract. **Do not introduce Tailwind v4 patterns into smile-admin without a migration plan.**

## Commands

Run inside the app folder (or via `npm --prefix <app>`):
- `npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck`
- `npm run dev` — boot ALL apps behind `localhost:3000` (hub gate + website + portals + Storybook). Individual apps: `npm run dev:website`, `npm run dev:smile`, `npm run dev:pm-ajay`, `npm run dev:eutthan`, `npm run dev:docs`, `npm run dev:hub`.
- `apps/hub`: root entry point at **:3000** (`npm run dev:hub`). Dev servers are defined in `.claude/launch.json`.
- `apps/dosje`: standalone at **:3001** (`npm run dev:website`), proxied at `/website` through the hub.
- Design tokens: `npm run build -w @mosje/tokens` (regenerate) · `npm test -w @mosje/tokens` (contract).

## Conventions (apply everywhere unless a rule file overrides)

- **TypeScript strict, no `any`.** Named exports. PascalCase components, camelCase utils.
- **Design tokens, never hardcoded values.** Use the brand tokens (`gov-blue #0373DF`, `saffron #F97316`, `gov-yellow #FFD323`, `ink`, `surface-muted`, …). When the design system lands, import from `@mosje/design-system`.
- **Noto Sans** is the typeface across all gov properties (DBIM standard). Don't introduce other fonts.
- **No Indian tricolour band/stripe motif** (the saffron-white-green flag bar) anywhere in UI chrome — headers, footers, hero bands, dividers — **unless the user explicitly asks for it.** A single brand-token accent is fine; the flag-stripe decoration is not. (Standing instruction, 2026-06-13.)
- **Logo & favicon: use the National Emblem** (`National-Emblem-logo.svg` / `National_Emblem_logo_white.svg` for dark) — never an invented/abstract mark.
- **Accessibility is non-negotiable** — these are government sites. Target **WCAG 2.1 AA + GIGW**: semantic HTML, alt text, keyboard nav, visible focus, AA contrast. Use the `accessibility-auditor` agent before shipping a page.
- **Real content, real assets** — no lorem/placeholder in production pages.
- `next/image` for images; `lucide-react` for icons (note: this version dropped the brand social icons — use inline SVGs).
- Mobile-first responsive; content max-width **1280px**.
- **AI design contract.** Before building or changing UI, read **`packages/design-system/design.md`** (token vocabulary, theming axes, component inventory, hard rules) — it's the authoritative AI-facing brief. Its companions `packages/design-system/AGENTS.md` and the portal's `/design-system/llms.txt` must stay in sync with tokens/components/Figma — see the rule in `.claude/rules/design-system.md`.
- **Commit messages: no AI attribution.** Never add `Co-Authored-By: Claude` (or any AI/bot co-author) or a "Generated with Claude Code" trailer to commits. A `.husky/commit-msg` hook strips them as a backstop, but don't write them in the first place.

## Safety rules (learned the hard way)

- **macOS is case-insensitive.** `Portals` and `portals` are the SAME directory. Never `mkdir` a case-variant of an existing dir, and never `rm -rf` a path you just `mv`'d into a case-colliding name. A `.claude/hooks/guard.sh` PreToolUse hook now **blocks `rm -rf` / `rm -r`, force-push, and other destructive commands** — run those manually and deliberately if truly needed.
- **Moves are non-destructive; deletes are not.** Prefer `mv`/copy-verify-then-`rmdir` (which refuses non-empty dirs). Never `rm -rf` project content without explicit human confirmation.
- Don't touch `Incoming/` (21 GB of raw source material) or commit it.
- Never read or commit `.env*` files or secrets.

## Workflow tooling (this `.claude/`)

- **Agents** (`.claude/agents/`): `code-reviewer`, `accessibility-auditor`, `design-system-guardian`, `debugger`.
- **Commands** (`.claude/commands/`): `/new-site`, `/new-portal`, `/qa-clone`, `/a11y`, `/sync-figma`.
- **Rules** (`.claude/rules/`): path-scoped specs for the website, portals, and design system.
- **Skills**: the global `clone-website` skill is how new sites are reverse-engineered; see `.claude/skills/README.md`.

## Active context

- `apps/dosje/` homepage is **built and committed** (14 components, faithful clone of dosje.gov.in).
- `packages/` design system is **live (Phase 2)**: `@mosje/tokens` (DTCG → Style Dictionary) generates the token contract; `@mosje/design-system` has 17 atoms + form layer, plus the **`data-color-mode` brand-axis theming** (ColorModeProvider/Switcher; modes: `blue-light` default, `blue-dark`, extensible). See `docs/superpowers/specs/` + `plans/`.
- `apps/portals/smile-admin` is **recovered and consolidated** into this repo (was a separate `smile-admin-portal` repo, now archived). `apps/portals/pm-ajay` MIS dashboard is built. The guard hook blocks `rm -rf` so the original loss never recurs.
- **Single-origin layout is live.** `apps/hub` is the root zone at **:3000**. All child apps mount via `basePath` — dosje at `/website`, portals at `/portals/<slug>`. Run `npm run dev` from the repo root to bring everything up. Add new portals by setting `basePath` + a hub rewrite + a `portals.ts` entry.
