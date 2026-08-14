# DS sync — kickoff prompt (E-Anudaan only)

Paste the block below into a fresh session. Every number in it was measured on 2026-08-13, not
estimated.

---

## The prompt

> I want to start the design-system sync activity, **scoped to the E-Anudaan portal only**
> (`/portals/e-anudaan`). It is our reference portal — the first one meant to be 100% aligned
> with the design system — and we will use it to implement and prove DS updates before any of
> them go near the other seven portals. Do not touch the other portals in this activity.
>
> **Read these first.** They encode decisions that override intuition, and several exist because
> the exact mistake they describe already happened:
> - `packages/design-system/design.md` — the authoritative AI-facing design context and the
>   component inventory. **Read this before proposing any new component.**
> - `.claude/rules/design-system.md` — the package contract, the four Storybook gates, the
>   design-context ratchet, the icon-scale ratchet, changelog freshness
> - `.claude/rules/component-authoring.md` — the mandatory checklist for any component created or
>   changed: zero raw values *including dimensions*, nested parts as library instances, variants
>   for structure and properties for options, **update in place — never fork a component key**
> - `.claude/rules/documentation-ds-linkage.md` — **bind by RESOLVED VALUE, not by name**
> - `CLAUDE.md` — the design-system-first rule: before writing UI, audit
>   `packages/design-system/index.ts`; if a component is missing, **add it to the DS first**,
>   export it, then import it. Never build one-off UI that belongs in the shared DS.
>
> **The honest starting position — and the thing I most want you to engage with.**
>
> E-Anudaan **passes** `npm run check:ds-linkage` with zero violations. That gate covers raw
> fills, strokes, padding, gaps and radii. It does **not** check whether the portal uses DS
> *components*, and on that measure the portal is not yet what its label claims. Measured across
> its 49 TSX files (32 of which import from `@mosje/design-system`):
>
> | Hand-rolled | Count | DS component that may already cover it |
> |---|---|---|
> | `<table>` | 7 | `DataTable` |
> | `<dl>` fact/summary lists | 6 | none — repeated four times, a promotion candidate |
> | `<button>` (filter chips, sign-out, inline actions) | 6 | `Button` / `Chip` / `SegmentedControl` |
> | progress bars (`h-1.5 rounded-full`) | 4 | `Progress` |
> | filter-chip rows | 2 | `Chip` / `SegmentedControl` |
> | raw `<input>` (per-document remarks) | 2 | `Input` |
>
> Imported today: `Alert · Badge · Button · Checkbox · DataTable · EmptyState · FormField · Icon ·
> Input · MetricCard · PasswordInput · PortalLoginShell · Radio · Search · Select · SidebarNav ·
> Textarea · useToast`. Not used at all, and worth checking against the screens: `Stepper`,
> `Tabs`, `Modal`, `SideSheet`, `ApprovalTimeline`, `Progress`, `Chip`, `SegmentedControl`,
> `FilterBar`, `KpiRow`, `ChartCard`, `DashboardGrid`, `ReviewSection` / `ReviewItem`, `Wizard`,
> `FormSection`, `MediaUpload`, `Lightbox`, `SlaProgressIndicator`, `Tooltip`, `Skeleton`.
>
> Some of the hand-rolling is defensible and some is not, and I want you to tell me which is
> which rather than mechanically replacing all of it. Two specifics to weigh:
> - The **review screen's Documents table** has a per-row `Select` and a per-row remarks input.
>   Check whether `DataTable` supports that before assuming it should be converted.
> - The **wizard** hand-rolls its stepper and its own field renderer while the DS ships `Wizard`,
>   `FormSection`, `ReviewSection`/`ReviewItem` and `MediaUpload`. That looks like the largest
>   single alignment gap.
>
> **What I want from you, in this order:**
>
> 1. **Audit, with evidence.** Run the real gates and report actual numbers, separating **gated**
>    failures from **advisory** ones: `npm run check:ds-linkage`, `npm run check:storybook`
>    (+ `:parity`, `:types`, `:smoke`), `npm run check:design-context`,
>    `npm run check:icon-scale`, `npm run check:changelog`, `npm --prefix apps/hub run check`,
>    `npm --prefix apps/hub test`, and `npm test -w @mosje/tokens`.
> 2. **Produce a component-by-component ledger** for the portal's 49 files: for each piece of
>    hand-rolled UI — *reuse an existing DS component* / *promote this into the DS* / *keep it
>    local, with a reason*. "Keep it local" needs an argument, not a shrug.
> 3. **Propose the sequence**, cheapest-and-safest first, and say what would make you stop and
>    re-plan. Do not start changing files until I have agreed the ledger.
>
> **Hard constraints:**
> - **Anything promoted into `packages/design-system` is not done without**, in the *same*
>   commit: the component, its Storybook story, its `design.md` entry, its docs-portal page, and
>   a changelog entry. Four CI gates enforce this; do not defer any of them.
> - **Never weaken a gate, baseline or threshold to pass.** A raw value that genuinely cannot be
>   bound gets a declared `ds-exempt(<category>)` with a reason saying *why* — categories:
>   `specimen`, `code-sample`, `demo-geometry`, `third-party`, `layout-literal`, `optical`.
>   Do not add entries to `coverage-baseline.json` or the icon-scale baseline to go green; those
>   ratchets only shrink.
> - **Icon sizes must be on the scale** `16 · 20 · 24 · 32 · 40 · 48 · 64`, set via the `size`
>   prop (a CSS class sets the box but not the `opsz` axis). E-Anudaan is currently clean here —
>   keep it that way.
> - **Bind by resolved value.** Resolve every candidate token to a hex and compare it to the
>   intended appearance before binding.
> - `e-anudaan.css` deliberately declares **no `--portal-*` overrides**, because the hub already
>   resolves those slots to the right `--sa-*` semantics. An earlier version pinned them to the
>   cloned vendor's greys, which made the portal drift from the DS by construction. **Do not
>   reintroduce overrides** without a comment saying why the DS token is wrong for this portal.
> - Behaviour must not regress. The portal has 107 tests including a workflow state machine and
>   a nav-drift guard; they must stay green, and the approval chain must still be walkable end to
>   end in the browser.
>
> **Context you will need:**
> - Branch `feat/e-anudaan-portal`, 6 commits, **not yet merged to `main`**. Merge (never rebase)
>   `origin/main` at the start of the session. Stage explicit paths — **never `git add -A`**; a
>   second session often shares this working tree.
> - `npm run dev` boots the hub on **:3007**; sign in through the demo console, bottom-left.
> - Four screens are **inferred, not cloned** — the PD Sanction Desk, the UC form, the inspection
>   meeting and wizard step 6 — because the live versions are unbuilt, unreachable or empty. Each
>   says so on the page. Treat their layout as ours to change freely.
> - **Figma Code Connect is NOT in place** (needs a Developer seat on an Org/Enterprise plan;
>   zero mappings, package not installed). Do not write plans that assume it exists — see
>   `docs/research/figma-code-connect-readiness.md`.
> - Tokens are DTCG JSON in `packages/tokens/src/` compiled by Style Dictionary. **Never edit
>   generated artifacts** (`packages/tokens/dist/`, `packages/design-system/tokens.css`,
>   `packages/config/tailwind-preset.cjs`).
>
> Start with step 1, and show me the ledger before you change anything.

---

## Why the prompt is shaped this way

- **It leads with the uncomfortable fact.** E-Anudaan passes the linkage gate but hand-rolls ~27
  pieces of UI. An agent told only "this portal is 100% DS-aligned" would confirm that and find
  nothing; one given the table goes looking in the right place.
- **It lists the unused DS components.** The fastest way to find alignment gaps is to ask why
  `Wizard`, `Stepper` and `ReviewSection` are shipping in the DS and unused by the portal that is
  supposed to exemplify it.
- **It demands a ledger before edits.** Mechanically swapping 7 tables for `DataTable` would be
  wrong in at least one case (per-row selects), so the judgment has to come first.
- **It states the full cost of promotion up front** — story, `design.md`, docs page, changelog,
  same commit — because that is the step most likely to be quietly skipped.
