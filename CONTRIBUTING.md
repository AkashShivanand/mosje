# Contributing to SAMAVESH

Thanks for improving the MoSJE design system. This guide covers the common changes. See
`GOVERNANCE.md` for the lifecycle, versioning, and review model.

## Setup

```bash
npm install                      # workspace install (packages/*)
npm run build -w @mosje/tokens   # generate the token artifacts
```

## Golden rules

- **Never hardcode values.** Use semantic tokens — the contract is `--sa-*`.
  The legacy `--ds-*` vocabulary was **retired on 2026-08-12 and resolves to nothing**;
  `grep -c -- "--ds-" packages/design-system/tokens.css` returns 0, and CSS drops an
  unresolvable `var()` in silence. Raw hex and Tier-1 primitives
  (`--sa-color-<palette>-<step>`) are blocked by token-lint.
- **Edit tokens at the source.** Change `packages/tokens/src/*.json`, then
  `npm run build -w @mosje/tokens`. Never hand-edit generated `dist/`, `design-system/tokens.css`,
  or `config/tailwind-preset.cjs`.
- **Accessibility is non-negotiable** — WCAG 2.2 AA + GIGW: semantic HTML, labels, keyboard
  support, visible focus, AA contrast, ≥44px targets.

## Changing a token

1. Edit the right tier in `packages/tokens/src/`: `primitive.json` (raw, private),
   `semantic.json` (the public contract), `component.json`.
2. `npm run build -w @mosje/tokens && npm test -w @mosje/tokens` (contract must stay green).
3. Commit the regenerated artifacts.

## Adding / changing a component

1. Follow the existing pattern: `"use client"`, `forwardRef`, `cn()`, a dependency-free
   `.ds-*` CSS file referencing tokens (no hex).
2. Export it from `packages/design-system/index.ts`. **Do not edit `components.css`** —
   it is generated (`npm run build:components-css`) and `check:components-css` fails a
   hand edit. It held 26 imports against 73 stylesheets while it was hand-maintained,
   so a bundler-less consumer silently received a design system missing its modal, its
   toast and its data table.
3. Add a **doc page** at
   `apps/hub/src/app/design-system/components/<group>/<name>/page.tsx`, rendered from
   `ComponentDocPage`. It takes the whole house shape as props — do not hand-roll a
   page; `check:ds-pages` will fail it, and the six elements a reader is owed arrive by
   construction:

   ```tsx
   <ComponentDocPage
     name="Checkbox"                    // Title Case, as a reader knows it
     status="Stable"
     summary="One or two sentences, in the department's register."
     figma={{ node: "checkbox" }}       // a key in FIGMA_NODES, or:
     // figma={{ absent: "Not yet published in the Figma library." }}
     specimen={<CheckboxPlayground />}  // the component, running
     propsFrom="CheckboxProps"          // ← generated; see below
     a11y={A11Y}                        // criteria, each with a status + evidence
     whenToUse={{ use: [...], avoid: [...] }}
     related={[{ label, href, reason }]}
   />
   ```

   **`propsFrom`, never a hand-written table.** `npm run build:props` reads the
   TypeScript type checker into `props.generated.ts`; pass the interface name.
   `check:props` fails when it is stale. Of twelve hand-written tables audited against
   their implementations, one matched — the rest invented props, inverted
   requiredness, or documented two of eleven. Use the `props` array only for what the
   checker cannot see (a hook's arguments, a sub-object shape), alongside `propsFrom`.

   **An accessibility row defaults to `untested`.** Mark it `verified` only when you
   can name the code or test that earns it, in `evidence`.
4. Add a **story** under `apps/storybook/stories/` — `check:storybook` fails a
   component without one, and the backlog is empty.
5. Run the gates locally:
   ```bash
   npm run build:props                 # if you changed a props interface
   npm run typecheck -w @mosje/design-system
   npm run verify                      # exactly what Apps CI runs
   ```
6. Update `CHANGELOG.md` and the changelog page. A change a consumer must act on is
   `kind: "Breaking"` with a `migration` string — the kind exists precisely so a release
   note is not just a list of news. New components land as **Alpha** (see lifecycle).

## Commit style

Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`). Keep changes focused; a token or
component change should not bundle unrelated edits.
