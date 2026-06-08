# SAMAVESH Form Atoms Implementation Plan (Plan 2)

> **For agentic workers:** execute task-by-task; verify each before moving on.

**Goal:** Add the accessible form layer the 20 portals depend on — `Input`, `Textarea`, `Select`, and the `FormField` molecule — on the SAMAVESH token contract, and give `@mosje/design-system` its own typecheck so components are self-verifying.

**Architecture:** Same proven pattern as the existing atoms — `"use client"` + `forwardRef` + `cn()`, dependency-free semantic `.ds-*` CSS referencing `--ds-*`/`--sa-*` tokens (no raw hex → token-lint clean), real native elements for built-in a11y. `FormField` wires label + control + hint + error via `id`/`htmlFor`/`aria-describedby`/`aria-invalid`. Touch targets ≥44px (WCAG 2.2).

**Tech Stack:** React 19, TypeScript strict, the existing `@mosje/tokens` contract.

**Note on process:** components ARE the deliverable, so full code lives in the files (not duplicated here); this plan lists tasks + acceptance. The design is already approved in the program spec (§4 component taxonomy).

---

## Task 1: Self-verifying typecheck for @mosje/design-system
- Add `tsconfig.json` (strict, react-jsx, bundler resolution) + `typecheck` script.
- Add devDeps: `typescript`, `@types/react`, `@types/react-dom`, `react`, `react-dom` (peer at runtime; dev for typecheck).
- **Acceptance:** `npm run typecheck -w @mosje/design-system` passes on the existing components.

## Task 2: `forms.css`
- Styling for `.ds-input`, `.ds-textarea`, `.ds-select`, `.ds-field` (FormField), using only `--ds-*`/`--sa-*` tokens (no hex).
- States: default, hover, focus-visible (primary ring), disabled, error (`aria-invalid`), required.
- Min control height 44px (touch), 40px via density-compact later.
- **Acceptance:** `npx stylelint --config .stylelintrc.tokens.json` on `forms.css` passes (0 errors).

## Task 3: `Input`, `Textarea`, `Select` atoms
- `input.tsx` — text/email/number/etc.; props extend native input (omit `size`), `invalid?`, `id` passthrough.
- `textarea.tsx` — native textarea, `invalid?`, auto-rows via `rows`.
- `select.tsx` — native `<select>` + chevron, `invalid?`, `options?` or children.
- **Acceptance:** typecheck passes.

## Task 4: `FormField` molecule
- Wraps a control: renders `<label>`, optional hint, optional error; wires `htmlFor`, `aria-describedby` (hint+error ids), `aria-invalid`, required marker.
- Render-prop or `children` receiving `{ id, describedBy, invalid }` so any control composes.
- **Acceptance:** typecheck passes.

## Task 5: Wire exports + verify estate
- Export the 4 from `index.ts`; add `forms.css` to `components.css` barrel.
- **Acceptance:** `npm run typecheck -w @mosje/design-system` green; `npm --prefix apps/dosje run build` green; token-lint on new CSS green. Commit.
