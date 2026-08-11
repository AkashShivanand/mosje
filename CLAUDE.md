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
| `apps/hub/` | Next.js 16 · React 19 · TS strict | Tailwind **v4** + shadcn | Root zone at :3007; **hosts every portal natively** at `/portals/<slug>`, and owns the single Tailwind build for all of them. |

**Tailwind after the single-origin consolidation:** the portals no longer have their own apps,
Tailwind installs, or `tailwind.config.ts` files — they are route groups inside `apps/hub`, so
there is exactly **one** Tailwind **v4** build across the estate. Each portal's old `theme.extend`
now lives in `apps/hub/src/app/globals.css` as **global utility names**, with the **per-portal
values** re-bound in `apps/hub/src/app/portals/<slug>/<slug>.css` under `[data-portal="<slug>"]`
(the portals' palettes genuinely conflict, so the values cannot be merged). Read the contract at
the top of `apps/hub/src/app/globals.css` before touching a portal colour, radius or shadow.
pm-ajay remains Tailwind-free by design — its MIS dashboard uses hand-rolled SVG charts and
`--ds-*` custom properties directly.

## Commands

Run inside the app folder (or via `npm --prefix <app>`):
- `npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck`
- `npm run dev` (repo root) — boots **one** process: the hub. That is the whole estate, Storybook
  included. There is no per-portal dev server, and no `dev:website` / `dev:docs` / `dev:smile` /
  `dev:pm-ajay` / `dev:eutthan` / `dev:scw` / `dev:nmba` / `dev:nhapoa` / `dev:tg` script.

| Process | Port | Script | Reached at |
|---------|------|--------|------------|
| `apps/hub` — **the entire estate** | **3007** | `npm run dev` | `/`, `/website`, `/design-system`, `/portals/<slug>`, `/reports/<slug>`, `/storybook` |
| `apps/storybook` — **authoring only** | 6006 | `npm run dev:storybook` | `localhost:6006` directly |

**Storybook is served by the hub, in dev exactly as in production.** The hub's build compiles it
into `apps/hub/public/storybook`, and `/storybook` serves those static files behind the site gate —
there is no proxy and no second Vercel project. A `predev` hook builds it once if it is missing, so
a fresh clone works with no extra step; `npm run build:storybook --prefix apps/hub` refreshes it.

Run `npm run dev:storybook` **only to author stories** — it is Storybook's own dev server with hot
reload, reached at `localhost:6006`. Note the static build takes precedence at `/storybook`, so
edits do not appear there until you rebuild. Nobody who is only *reading* Storybook needs :6006.

Dev servers are defined in `.claude/launch.json`. Everything else lives under `apps/hub/src/app/` —
the website at `website/`, the docs at `design-system/`, and the portals at `portals/<slug>`
(scw, nmba, nhapoa, tg, smile-admin, pm-ajay, eutthan-admin).
`apps/dosje` and `apps/docs` no longer exist as apps.
- Design tokens: `npm run build -w @mosje/tokens` (regenerate) · `npm test -w @mosje/tokens` (contract).

## Conventions (apply everywhere unless a rule file overrides)

- **TypeScript strict, no `any`.** Named exports. PascalCase components, camelCase utils.
- **Design tokens, never hardcoded values.** Use the brand tokens (`gov-blue #0373DF`, `saffron #F97316`, `gov-yellow #FFD323`, `ink`, `surface-muted`, …). When the design system lands, import from `@mosje/design-system`.
- **Noto Sans** is the typeface across all gov properties (DBIM standard). Don't introduce other fonts.
- **No Indian tricolour band/stripe motif** (the saffron-white-green flag bar) anywhere in UI chrome — headers, footers, hero bands, dividers — **unless the user explicitly asks for it.** A single brand-token accent is fine; the flag-stripe decoration is not. (Standing instruction, 2026-06-13.)
- **Logo & favicon: use the National Emblem** (`National-Emblem-logo.svg` / `National_Emblem_logo_white.svg` for dark) — never an invented/abstract mark.
- **Accessibility is non-negotiable** — these are government sites. Target **WCAG 2.1 AA + GIGW**: semantic HTML, alt text, keyboard nav, visible focus, AA contrast. Use the `accessibility-auditor` agent before shipping a page.
- **Real content, real assets** — no lorem/placeholder in production pages.
- `next/image` for images; **`<Icon>`** from `@mosje/design-system` for icons — **use Material Symbols Rounded** (the official SAMAVESH icon system). Standard spec: weight 300, size 24, stroke variant. Load the font once per app: `import "@mosje/design-system/icons.css"` in the root layout. For brand/social logos (National Emblem, etc.) use inline SVGs.
- Mobile-first responsive; content max-width **1280px**.
- **AI design contract.** Before building or changing UI, read **`packages/design-system/design.md`** (token vocabulary, theming axes, component inventory, hard rules) — it's the authoritative AI-facing brief. Its companions `packages/design-system/AGENTS.md` and the portal's `/design-system/llms.txt` must stay in sync with tokens/components/Figma — see the rule in `.claude/rules/design-system.md`.
- **Design-system-first (MANDATORY for every screen and component, no exceptions).** Before writing a single line of UI code for any screen, run a DS audit:
  1. List every UI element the screen needs (button, input, tab switcher, layout shell, chart, etc.).
  2. Check `packages/design-system/index.ts` + `design.md` — if it exists there, import it; never re-implement it per-app.
  3. If a needed component is missing from the DS: **add it to `packages/design-system/` first**, export it from the barrel, then import it. Never build one-off UI that belongs in the shared DS.
  4. Document the audit inline as a short comment block at the top of your plan: `DS Audit: Button ✅ existing · Input ✅ existing · PortalLoginShell ➕ adding to DS`.
  5. Page-level layout templates (login shell, dashboard shell, list shell) belong in the DS and must be reused across all portals — only the slot content (logo, portal name, tabs, form fields) changes per portal.
- **Documentation is not exempt from the design system — it is the strictest case.** Every
  element on a Figma library documentation page and on every `apps/hub/src/app/design-system/**`
  page must be **bound** to the DS: text to published text styles, fills/strokes to Color
  variables, padding/gap to Space, radius to Radius. A literal that merely *equals* a token is a
  defect — when the token moves, the binding follows and the literal silently stops matching.
  The only exemption is a **specimen** (a deliberate off-role value being demonstrated), and it
  must be *named* as one so an audit can account for it. See `.claude/rules/documentation-ds-linkage.md`.
- **Commit messages: no AI attribution.** Never add `Co-Authored-By: Claude` (or any AI/bot co-author) or a "Generated with Claude Code" trailer to commits. A `.husky/commit-msg` hook strips them as a backstop, but don't write them in the first place.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec

## Branching & merging (MANDATORY — every task, module, feature, fix)

**Never commit to `main`.** Every new task, module, feature, refactor or fix starts on its
own branch and reaches `main` through a pull request. A `.husky/pre-commit` gate refuses
commits made on `main` (bypass deliberately with `git commit --no-verify` when you truly
mean it, e.g. a hotfix you are about to push alone).

```bash
git switch main && git pull                 # start from current main, always
git switch -c <type>/<short-slug>            # feat/ fix/ ds/ docs/ chore/
```

### A branch is short-lived, and that is the part that actually prevents conflicts

Isolating work on a branch does **not** by itself avoid merge conflicts — a branch that
lives a long time *causes* them, because `main` moves underneath it. The 14-conflict merge
on 2026-08-11 happened on a branch that was **12 commits behind `main`**, not because the
work was branched.

So the discipline is two-sided, and the second half is the one people skip:

1. **Sync from `main` at the start of every working session, and again before opening the
   PR** — `git merge origin/main`. Cheap and boring while the branch is young; expensive and
   error-prone once it is not.
2. **Merge to `main` when the unit of work is done, not when the whole initiative is.** If a
   branch cannot land within a few days, it is too big — split it. "Merge at the end" is only
   safe when the end arrives quickly.

**Merge, do not rebase, on this repo.** A rebase of a long branch here conflicted badly
enough to be abandoned (2026-08-11); `git merge origin/main` resolved the same divergence.
Rebase is fine for a young branch you own alone.

### Conflict magnets to expect, and how to resolve them

- **Hand-maintained version histories** — `apps/hub/src/app/design-system/resources/changelog/page.tsx`
  and the `design.md` header. Two branches appending releases in parallel **will** collide on
  the same version number. Resolution: `main`'s numbers are published and stand; the
  unmerged branch renumbers upward. Keep **both** sets of entries — never drop one — and
  check the result is strictly descending with exactly one `current: true`.
- **Generated baselines** — `packages/tokens/test/visual-contract.fixture.json` and friends.
  Git will happily auto-merge these into a union that matches **neither** build. Regenerate
  deliberately (`node test/lib/write-visual-contract.mjs --visual`), then *audit the diff
  against both parents* rather than trusting it: every changed key must be attributable to
  one side's intended change.
- **`add/add` on the same path** — happens when work reaches `main` via a different branch
  than the one you hold it on. Do not assume "ours" is newer: diff both and take the one
  carrying the later fix, then re-apply whatever your side uniquely contributed.

### After the PR

Delete the branch once merged, and **never reuse a branch whose PR was closed** — start a
fresh one from current `main`. A stale local branch whose remote was deleted is how this
repo ended up with `feat/hub-registry-admin` still holding commits after PR #40 was closed.

## Brand modes: `dbim` is CODE-ONLY (standing instruction, 2026-08-11)

The estate carries **three** brand modes on the `data-brand` axis, and they are not equal in
where they may travel:

| mode | key colour | goes to Figma? |
|------|-----------|----------------|
| `blue` (default) | `#0373DF` gov-blue | yes |
| `navy` | `#003366` | yes |
| `dbim` | `#162F6A` — DBIM's own key colour | **NO — never, unless explicitly asked** |

`dbim` exists so DBIM's published palette can be evaluated and demonstrated **in the running
app**. It is DBIM's own Blue primary palette transcribed, not a ramp derived from one anchor:
DBIM publishes five numbered shades (1 = darkest = key colour → 5 = lightest) and all five are
reproduced verbatim, with the intervening rungs interpolated. Source: `docs/source-brd/MoSJE
DBIM Audit.pdf` p.14 (DBIM section 2.1, Figure 1 'Primary palette'). Blue group:
`1 #162F6A · 2 #214AAB · 3 #5279D7 · 4 #A3BBF3 · 5 #D2DFFF`.

**The Figma library's Palette collection stays `[Blue, Navy]`.** That is enforced by
construction, not by discipline — `build/formats/figma-variables.mjs` declares those two modes
as a hardcoded list and reads only `colorModes.navy`, so a third brand cannot reach Figma by
accident. Do not "fix" that by adding a Dbim mode; adding one is a deliberate act that needs
asking first.

Two DBIM usage rules ship with the palette and apply wherever `dbim` is active:
- **Text** uses shade 1 or 2 (DBIM §4.4).
- **Icons and the footer** use the key colour, i.e. shade 1 (DBIM §3.7, §5.6) — the two
  checkpoints the MoSJE DBIM audit currently fails.

## Safety rules (learned the hard way)

- **macOS is case-insensitive.** `Portals` and `portals` are the SAME directory. Never `mkdir` a case-variant of an existing dir, and never `rm -rf` a path you just `mv`'d into a case-colliding name. A `.claude/hooks/guard.sh` PreToolUse hook now **blocks `rm -rf` / `rm -r`, force-push, and other destructive commands** — run those manually and deliberately if truly needed.
- **Moves are non-destructive; deletes are not.** Prefer `mv`/copy-verify-then-`rmdir` (which refuses non-empty dirs). Never `rm -rf` project content without explicit human confirmation.
- Don't touch `Incoming/` (21 GB of raw source material) or commit it.
- Never read or commit `.env*` files or secrets.
- **A `.husky/pre-push` hook typechecks the hub before anything reaches `main`.**
  CI already builds the hub (`Apps CI`: lint → check → build) and it works — but
  a commit pushed **straight to main** makes CI report *after the fact*, racing
  the production deploy. That is exactly how a deleted module reached
  production: `Apps CI` failed on it and the Vercel deploy failed on it, at the
  same time, after it had landed. Required status checks would prevent that, but
  branch protection needs GitHub Pro or a public repo — so the gate is local.
  It runs only when pushing `main`, takes ~3s, and is bypassable with
  `git push --no-verify` when you mean it. **Prefer a PR**: on a feature branch
  the hook stands aside and the full CI runs on the pull request, which is the
  path that catches everything rather than just unresolved imports.

## Workflow tooling (this `.claude/`)

- **Agents** (`.claude/agents/`): `code-reviewer`, `accessibility-auditor`, `design-system-guardian`, `debugger`.
- **Commands** (`.claude/commands/`): `/new-site`, `/new-portal`, `/qa-clone`, `/a11y`, `/sync-figma`.
- **Rules** (`.claude/rules/`): path-scoped specs for the website, portals, and design system.
- **Skills**: the global `clone-website` skill is how new sites are reverse-engineered; see `.claude/skills/README.md`.

## Active context

- `apps/dosje/` homepage is **built and committed** (14 components, faithful clone of dosje.gov.in).
- `packages/` design system is **live (Phase 2)**: `@mosje/tokens` (DTCG → Style Dictionary) generates the token contract; `@mosje/design-system` has 17 atoms + form layer, plus the **`data-color-mode` brand-axis theming** (ColorModeProvider/Switcher; modes: `blue-light` default, `blue-dark`, extensible). See `docs/superpowers/specs/` + `plans/`.
- `apps/portals/smile-admin` is **recovered and consolidated** into this repo (was a separate `smile-admin-portal` repo, now archived). `apps/portals/pm-ajay` MIS dashboard is built. The guard hook blocks `rm -rf` so the original loss never recurs.
- **Single-origin layout is live.** `apps/hub` is the root zone at **:3007**. All child apps mount via `basePath` — dosje at `/website`, portals at `/portals/<slug>`. Run `npm run dev` from the repo root to bring everything up. Add new portals by setting `basePath` + a hub rewrite + a `portals.ts` entry.
- **The estate is deployed to Vercel** at `mosje-samavesh.vercel.app`, behind a **shared-password site gate** (Vercel's own password protection is a Pro feature; the team is on Hobby). The gate lives in `apps/hub/src/proxy.ts` + `src/lib/site-gate.ts`; the wall itself is `/gate`. It is an access wall for a prototype, **not authentication** — the portal logins inside are unaffected.
  - The expected token resolves **store → env → off**: `gate_token` in the `hub_settings` table of the `mosje-hub` Supabase project, else HMAC of `SITE_PASSWORD`, else the gate is disabled. The env var is the **floor**, so a paused or unreachable database degrades to a working gate rather than an open site. `SITE_PASSWORD` unset ⇒ gate off, which is why local dev is untouched.
  - Only the **HMAC digest** is ever stored, never the plaintext password.
  - Change the password at **`/admin`**, guarded by `ADMIN_PASSWORD` and deliberately **outside** the gate — it is the recovery path when the gate password is lost. Admin auth is one shared secret behind `requireAdmin()` in `src/lib/admin/auth.ts`; named accounts replace that function's internals and nothing else.
  - Crawling is off estate-wide via `src/app/robots.ts` unless `ALLOW_INDEXING=true`.
  - Test it locally with the `hub-gated` launch config (serves a production build with both passwords set). See `docs/superpowers/specs/2026-08-06-hub-admin-settings-design.md`.
