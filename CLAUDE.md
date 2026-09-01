# MoSJE — Project Brain

> **Cross-tool note.** [`AGENTS.md`](./AGENTS.md) is the shared entry point every
> tool reads — Codex, Cursor, Antigravity, Gemini, Copilot. This file is the
> Claude-flavoured superset. A guardrail that must bind everyone belongs in
> `AGENTS.md`, in `.claude/rules/*.md` (plain markdown any agent can open), or —
> best — in `.husky/*` and CI, which bind whoever runs git regardless of tool.

> Loaded every turn. Kept to operative directives only. Full narrative, incident
> records and rationale: `docs/rules-rationale/CLAUDE-md-full-2026-08-20.md`.
> Path-scoped rules live in `.claude/rules/` and load when you touch their paths.
> Full structure map: `MOSJE-ARCHITECTURE.md`.

## Task Summary Rule (MANDATORY — every task, every conversation)

End every response with a summary in **plain, non-technical language**, written for
someone who did not watch you work. Always last. No exceptions, however small the task.

**Where anything changed, lead with a before → after table**, one row per change:

| What | Before | After | Why |
|---|---|---|---|
| the thing, named the way a non-developer would name it | what it did / looked like | what it does now | the reason, in one sentence a non-developer can act on |

Then:

**What I did:** one or two sentences covering the whole change.
**What's working:** what the user can now do or see.
**What's next / Recommendations:** follow-ups, pending items, things to know.
**Agents & tokens used:** which model(s) or helper agents did the work, and an
approximate token cost for the task.

Rules for the table:
- **Every change gets a row.** If it was worth doing, it is worth one line. A change
  left out of the summary is a change the user cannot review.
- **Name things by what they look like, not what they are called in code.** "The button
  that clears the chat", not `.ds-chatbot__end`.
- **"Why" is the load-bearing column.** "It was red, which on this estate means a
  rejected application" tells the user something; "improved semantics" does not.
- **Say what did NOT change** when a reader might reasonably assume it did.
- **Anything left undone, blocked, or deliberately skipped goes in the summary**, not
  only in the body — including work that needs a human (a Figma edit, a secret, an
  approval).

Rules for the agents & tokens line:
- **Say what was requested, never what was confirmed.** There is no way to verify from
  inside a conversation which model actually executed a call — not even this one's own.
  Phrase it as "Opus 5 (main session) requested" or "Sonnet helper requested for
  parallel search," never "ran on" or "handled by," which claims certainty that
  doesn't exist.
- **If no helper agents were used, say so plainly** rather than skipping the line.
- **The token figure is an estimate**, taken from the session's running token budget
  (`<total_tokens>` remaining) before vs. after the task — always label it "approx."
  Never present it as an exact or billed number.
- If no reliable figure is available, say "not tracked for this task" instead of
  guessing.

## What this is

Digital estate for the **Ministry / Department of Social Justice & Empowerment
(DoSJE), Government of India**. Two parts:

1. **The Website** (`apps/hub/src/app/website/`) — one unified informational site
   consolidating **13 legacy websites**. Built and live. Public, content-driven.
2. **The Portals** (`apps/hub/src/app/portals/<slug>/`) — **20 workflow portals**
   covering 33+ organisations & schemes (SMILE, PM-AJAY, NOS, NSFDC, NMBA, …).
   Authenticated, transactional.

**North-star:** everything renders from one shared design system
(`packages/design-system/`) kept 100% in sync with a Figma library.

**Code Connect is in place.** 8 parserless `*.figma.ts` templates beside their
components; `@figma/code-connect` v2 in `packages/design-system`; `figma.config.json`
at the repo root. Mappings resolve in Dev Mode automatically, but publishing the rich
templated snippet needs `npm run figma:connect` **from the REPO ROOT** with a
`FIGMA_ACCESS_TOKEN` (a secret — no agent session creates, reads or commits it).
Running it from a workspace silently publishes nothing, because the include glob is
root-relative. Never add `-w @mosje/design-system`. `npm run figma:connect:check`
dry-runs; `npm run check:code-connect` gates drift. Status:
`docs/research/figma-code-connect-readiness.md`.

## Structure

```
mosje/                      # single git repo
├── apps/
│   ├── hub/                # THE WHOLE ESTATE (Next 16, React 19, Tailwind v4, shadcn, Noto Sans)
│   │   └── src/app/        #   website/ · design-system/ · portals/<slug> · reports/<slug>
│   └── storybook/          # story authoring only; the hub compiles it to /storybook
├── packages/
│   ├── tokens/             # @mosje/tokens — DTCG → Style Dictionary (CSS/TS/Tailwind/Figma)
│   ├── design-system/      # @mosje/design-system — shared UI
│   └── config/             # @mosje/config — tailwind / eslint / tsconfig presets
├── docs/                   # specs, plans, research, compliance, source-brd/, rules-rationale/
├── Assets/                 # brand assets · Designs/ .fig exports (gitignored)
├── Incoming/               # raw drops — gitignored · _backups/ — gitignored
└── .claude/                # agents, commands, hooks, rules, skills
```

npm workspaces: `["packages/*", "apps/*", "apps/portals/*"]` (the last matches nothing
since portals became route groups). Registry: `MOSJE-ARCHITECTURE.md`.

**Tailwind:** exactly **one** Tailwind v4 build across the estate, owned by `apps/hub`.
Per-portal `theme.extend` values are re-bound in
`apps/hub/src/app/portals/<slug>/<slug>.css` under `[data-portal="<slug>"]` (palettes
genuinely conflict). Read the contract at the top of `apps/hub/src/app/globals.css`
before touching a portal colour, radius or shadow. pm-ajay is Tailwind-free by design.

## Commands

- `npm run dev` (repo root) boots **one** process — the hub, which is the whole estate,
  Storybook included. There is no per-portal dev server.
- Per app: `npm run dev` · `build` · `lint` · `typecheck`
- Tokens: `npm run build -w @mosje/tokens` · `npm test -w @mosje/tokens`

| Process | Port | Script | Reached at |
|---|---|---|---|
| `apps/hub` — the entire estate | **3007** | `npm run dev` | `/`, `/website`, `/design-system`, `/portals/<slug>`, `/reports/<slug>`, `/storybook` |
| `apps/storybook` — authoring only | 6006 | `npm run dev:storybook` | `localhost:6006` |

Storybook is compiled into `apps/hub/public/storybook` and served at `/storybook` behind
the site gate, in dev exactly as in production. Run `dev:storybook` **only to author
stories**; the static build takes precedence at `/storybook` until you rebuild
(`npm run build:storybook --prefix apps/hub`). Dev servers: `.claude/launch.json`.

## Conventions

- **TypeScript strict, no `any`.** Named exports. PascalCase components, camelCase utils.
- **Design tokens, never hardcoded values.** Brand tokens: `gov-blue #0373DF`,
  `saffron #F97316`, `gov-yellow #FFD323`, `ink`, `surface-muted`. Import from
  `@mosje/design-system`.
- **Standards precedence — quality first.** Authority order: (1) current design-craft
  standards incl. **WCAG 2.2 AA**, (2) DBIM, (3) GIGW 3.0, (4) UX4G. Adopt 2–4 wherever
  they fit **without hampering quality**. When a standard specifies a set of values,
  **ADD what is missing; never DELETE what quality needs** — its list is a floor, not a
  ceiling. Where a standard would force a worse interface, quality wins and the deviation
  is *documented*. Accessibility is never traded against.
  → `.claude/rules/standards-precedence.md`
- **Government standards live in `docs/guidelines/`** — GIGW 3.0 and DBIM 3.0 (mandatory),
  UX4G 3.0 (recommended), GuDApps (best practice), each as PDF + markdown. Start at
  `docs/guidelines/README.md`. Adopt accessibility/legal unconditionally, structural
  conventions in `--sa-*` names, **not** brand/aesthetic preferences (UX4G's violet
  primary, its icon default) — DBIM and SAMAVESH set our brand. Never weaken a
  requirement to make something pass; record the divergence. → `.claude/rules/guidelines.md`
- **Noto Sans** across all gov properties. Don't introduce other fonts.
- **No Indian tricolour band/stripe motif** in UI chrome unless explicitly asked (2026-06-13).
- **Logo & favicon: the National Emblem** (`National-Emblem-logo.svg`, `_white` for dark) —
  never an invented mark.
- **Accessibility is non-negotiable** — WCAG 2.2 AA + GIGW: semantic HTML, alt text,
  keyboard nav, visible focus, AA contrast. Run the `accessibility-auditor` agent before
  shipping a page.
- **Real content, real assets** — no lorem/placeholder in production pages.
- **Nothing on the screen the screen does not need, and copy in a government
  register.** The interface shows the citizen's information; it never narrates
  its own construction. Feed diagnostics, absence notes and instructions for
  reading a chart belong in `docs/audit/*.md`, the PR body or the chat — not
  under a map. Copy is plain, formal and factual, prefers the department's own
  words, and **all titles are Title Case** unless stated otherwise. Section
  headings are the DS `SectionTitle`, never hand-rolled.
  → `.claude/rules/ui-restraint-and-copy.md`
- **Live first, snapshot second, never an empty state.** Any figure sourced from an API
  renders live where the API answers and from a committed mirrored snapshot where it does
  not — the page says which. A metric neither source publishes is left OFF the design, not
  shown as "Not yet reported". Ratios take numerator and denominator from the same source;
  mixing them published a `138%`. → `.claude/rules/live-data-fallback.md`
- **A dashboard offers three data modes** — live, illustrative, and both — from the demo
  rail. Figures merge by declared GROUP, never field: a missing part of a known sum is
  derived, not mocked, and a zero is judged by whether its group has any figure at all.
  Every card carries a provenance chip in every mode, because the real risk is an
  illustrative number reaching a deck as a departmental one.
  → `.claude/rules/prototype-data-modes.md`
- `next/image` for images; **`<Icon>`** from `@mosje/design-system` for icons — **Material
  Symbols Rounded**, weight 300, size 24, stroke variant. Load once per app:
  `import "@mosje/design-system/icons.css"`. Brand/social logos are inline SVGs.
- **MANDATORY VISUAL AUDIT:** every component, page, wizard or portal change must be
  screenshotted and audited against SAMAVESH standards **before** declaring completion.
  Lint/typecheck passing without visual verification is forbidden.
- Mobile-first responsive. **Content width is `.sa-container`, never a restated number** —
  UX4G 3.0 ("Grid and layout") publishes **1200px desktop / 1320px desktop-XL** but **no
  breakpoints at all**, so where each engages is the estate's own decision. The cap is a
  **three-step ladder** — 1200, then 1320 from **1440**, then 1440 from **1920** — and the
  margin ladder (16 / 24 from 768 / 32 from 1920) steps with the CAP, not the viewport, so
  content only ever grows: **1152 → 1272 → 1376**. The `≥1768px` this line used to name was a
  retired anchor, and it was never UX4G's. Bind to `.sa-container` and add no `px-*` of your
  own — it owns the cap *and* the responsive margin.
- **AI design contract:** read `packages/design-system/design.md` before building or
  changing UI. Its companions `AGENTS.md` and `/design-system/llms.txt` stay in sync →
  `.claude/rules/design-system.md`.
- **Design-system-first (MANDATORY, every screen, no exceptions).** Before writing UI code:
  1. List every UI element the screen needs.
  2. Check `packages/design-system/index.ts` + `design.md` — if it exists, import it.
  3. If missing, **add it to the DS first**, export from the barrel, then import.
  4. Document the audit inline: `DS Audit: Button ✅ existing · PortalLoginShell ➕ adding to DS`.
  5. Page-level layout templates (login/dashboard/list shells) belong in the DS and are
     reused across portals — only slot content changes.
  6. **Authoring standard (Figma + code):** every component must pass
     `.claude/rules/component-authoring.md` — discover first, tokenise everything (zero raw
     values), nested parts are library instances, add-and-flag anything missing, variants
     for structure + properties for options, match the reference, pass WCAG AA, flag
     questionable properties for the human, document, validate with a screenshot and a
     zero-unbound audit.
- **Documentation is the strictest case of the design system.** Every element on a Figma
  documentation page and on every `apps/hub/src/app/design-system/**` page must be **bound**
  — text to published styles, fills/strokes to Color variables, padding/gap to Space, radius
  to Radius. A literal that merely *equals* a token is a defect. The only exemption is a
  **specimen**, and it must be named as one. → `.claude/rules/documentation-ds-linkage.md`
- **Commit messages: no AI attribution.** Never add `Co-Authored-By: Claude` or a
  "Generated with Claude Code" trailer. `.husky/commit-msg` strips them as a backstop.

## Skill routing

When a request matches a skill, invoke it via the Skill tool. When in doubt, invoke it.

**Design work starts by naming the layer.** The `layers-*` pack (Layers of Product Design,
7 layers over 3 zones) is installed project-wide. `/layers-intro` loads the framework;
`/layers-orient` audits all seven layers and names the bottleneck. Run orient **before**
`/autoplan` or `/spec` on a design brief — this estate's recurring failure mode is solving a
Layer 2 (vocabulary) or Layer 5 (object model) problem at Layer 7. Index and MoSJE-specific
guidance: `.claude/skills/README.md`.

| Request | Skill |
|---|---|
| **Which layer is this problem actually at?** | **`/layers-orient`** — pre-flight |
| Framework context for any `/layers-*` work | `/layers-intro` — load first |
| Scheme/org terminology, citizen vs. administrative language | `/layers-domain` |
| Objects, states, relationships shared across portals | `/layers-conceptual-model` |
| User needs, job stories, persona claims | `/layers-user-needs` |
| Flows, edge cases, empty / loading / error states | `/layers-interaction-flow` |
| Which needs to serve, which bets to place | `/layers-product-strategy` |
| Research planning & synthesis | `/layers-observed-behaviour` |
| Product ideas / brainstorming | `/office-hours` |
| Strategy / scope | `/plan-ceo-review` |
| Architecture | `/plan-eng-review` |
| Design system / plan review | `/design-consultation`, `/plan-design-review` |
| Full review pipeline | `/autoplan` |
| Bugs / errors | `/investigate` |
| QA / testing site behaviour | `/qa`, `/qa-only` |
| Code review / diff check | `/review` |
| Visual polish | `/design-review` |
| Ship / deploy / PR | `/ship`, `/land-and-deploy` |
| Save / resume progress | `/context-save`, `/context-restore` |
| Backlog-ready spec | `/spec` |

**Surface stays ours.** `/layers-surface` exists but is standards-blind. Visual and
interaction surface work routes to `/design-review` + `/gov-compliance` +
`accessibility-auditor` — those know WCAG 2.2 AA, DBIM, GIGW 3.0 and the token contract.
Use `/layers-surface` only as an extra lens for tracing a surface defect down to the layer
that caused it.

## Branching & merging (MANDATORY)

**Never commit to `main`.** Every task starts on its own branch and reaches `main` via a
PR. A `.husky/pre-commit` gate refuses commits on `main`.

```bash
git switch main && git pull
git switch -c <type>/<short-slug>          # feat/ fix/ ds/ docs/ chore/
```

**A new session does not mean a new branch** — continue the task's existing branch.
Procedure, worktree escape hatches and the two ways switching goes wrong here:
`.claude/rules/branch-continuity.md`.

**A branch must be short-lived.** Branching alone does not avoid conflicts; a long branch
*causes* them. So: **sync from `main` at the start of every session and again before the
PR** (`git merge origin/main`), and **merge when the unit of work is done, not when the
initiative is**. If a branch can't land within a few days, split it.

**Merge, do not rebase, on this repo.** Rebasing a long branch here conflicted badly
enough to be abandoned (2026-08-11); `git merge origin/main` resolved the same divergence.
Rebase is fine for a young branch you own alone.

**Conflict magnets:** hand-maintained version histories (the changelog page, the
`design.md` header — keep **both** sets of entries, renumber the unmerged branch upward)
and generated baselines (regenerate deliberately, then audit the diff against both
parents). On `add/add`, diff both sides and take the later fix. Detail in the archived
narrative doc.

Delete a branch once merged, and **never reuse a branch whose PR was closed**.

## Brand modes: `dbim` is CODE-ONLY (standing instruction, 2026-08-11)

| mode | key colour | goes to Figma? |
|---|---|---|
| `blue` (default) | `#0373DF` gov-blue | yes |
| `navy` | `#003366` | yes |
| `dbim` | `#162F6A` | **NO — never, unless explicitly asked** |

`dbim` exists so DBIM's published palette can be evaluated in the running app. It is
DBIM's own Blue primary palette transcribed verbatim (5 numbered shades, intervening
rungs interpolated), per `docs/source-brd/MoSJE DBIM Audit.pdf` p.14:
`1 #162F6A · 2 #214AAB · 3 #5279D7 · 4 #A3BBF3 · 5 #D2DFFF`.

The Figma Palette collection stays `[Blue, Navy]`, enforced by construction in
`build/formats/figma-variables.mjs`. Do not add a Dbim mode without asking.

Two DBIM usage rules where `dbim` is active: **text** uses shade 1 or 2 (§4.4); **icons
and the footer** use the key colour, shade 1 (§3.7, §5.6).

## Safety rules (learned the hard way)

- **macOS is case-insensitive.** `Portals` and `portals` are the SAME directory. Never
  `mkdir` a case-variant of an existing dir, and never recursively delete a path you just
  `mv`'d into a case-colliding name. `.claude/hooks/guard.sh` blocks recursive deletes,
  force-push and other destructive commands.
- **Moves are non-destructive; deletes are not.** Prefer `mv`, or copy-verify-then-`rmdir`
  (which refuses non-empty dirs). Never recursively delete project content without
  explicit human confirmation.
- **Never `git add -A` or `git commit -a`. Stage explicit paths.** Sessions share this
  working tree, and a tree has no idea which of them authored a change — a `git add -A`
  on 2026-08-12 swept 15 files of a parallel session's work into an unrelated commit.
  `git status` before staging and **read it**; files you don't recognise are somebody
  else's work. `git diff --cached --stat` before committing — if the file count exceeds
  your change, stop.
- Don't touch or commit `Incoming/` (21 GB of raw source).
- Never read or commit `.env*` files or secrets.
- **`.husky/pre-push` typechecks the hub before anything reaches `main`.** CI builds the
  hub, but a commit pushed straight to `main` makes CI report *after* the deploy races it.
  The gate runs only when pushing `main`, takes ~3s, and is bypassable with
  `--no-verify`. **Prefer a PR** — on a feature branch the full CI runs on the PR.

## Workflow tooling (`.claude/`)

- **Agents:** `code-reviewer`, `accessibility-auditor`, `design-system-guardian`, `debugger`.
- **Commands:** `/new-site`, `/new-portal`, `/qa-clone`, `/a11y`, `/sync-figma`.
- **Rules:** path-scoped; see `.claude/rules/design-system-architecture.md` for UI architecture rules.
- **Skills:** the global `clone-website` skill reverse-engineers new sites.

## Active context

- The **website** (14 components, a faithful dosje.gov.in clone) is live at `/website`.
- **Design system is live (Phase 2):** `@mosje/tokens` generates the token contract;
  `@mosje/design-system` exports **90 components** (`scripts/lib/ds-exports.mjs`
  enumerates; both Storybook-coverage gates ratchet), plus `data-brand` theming
  (ColorModeProvider/Switcher; `blue` default, `navy`; `dbim` deliberately outside
  `COLOR_MODES`). Specs: `docs/superpowers/specs/` + `plans/`.
- **smile-admin** and the **pm-ajay** MIS dashboard are route groups under
  `apps/hub/src/app/portals/`, not standalone apps.
- **Single-origin layout is live.** `apps/hub` is the root zone at :3007; children mount
  via `basePath`. Add a portal with `basePath` + a hub rewrite + a `portals.ts` entry.
- **Deployed to Vercel** at `mosje-samavesh.vercel.app` behind a **shared-password site
  gate** (`apps/hub/src/proxy.ts` + `src/lib/site-gate.ts`; the wall is `/gate`). It is an
  access wall for a prototype, **not authentication**; portal logins are unaffected.
  - Token resolves **store → env → off**: `gate_token` in `hub_settings` (Supabase
    `mosje-hub`), else HMAC of `SITE_PASSWORD`, else disabled. The env var is the floor,
    so a paused database degrades to a working gate rather than an open site.
    `SITE_PASSWORD` unset ⇒ gate off, so local dev is untouched.
  - Only the **HMAC digest** is stored, never the plaintext.
  - Change the password at **`/admin`**, guarded by `ADMIN_PASSWORD` and deliberately
    **outside** the gate — it is the recovery path. Auth is one shared secret behind
    `requireAdmin()` in `src/lib/admin/auth.ts`.
  - Crawling is off estate-wide via `src/app/robots.ts` unless `ALLOW_INDEXING=true`.
  - Test locally with the `hub-gated` launch config.
