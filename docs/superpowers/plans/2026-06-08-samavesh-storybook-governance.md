# SAMAVESH Storybook + Governance Implementation Plan (Plan 3)

**Goal:** Stand up the living documentation portal (`apps/docs`, Storybook) and the governance + CI quality gates that make SAMAVESH a versioned product, not just a folder.

**Architecture:** Storybook 8 on `@storybook/react-vite` (lightest fit — components are React + plain CSS, no Next needed). Global toolbar toggles `data-theme` (light/dark/high-contrast) and `data-density` on the preview root; preview imports the generated `tokens.css` + `components.css`. Governance as markdown; CI as a GitHub Actions workflow running the existing gates (tokens contract test, package typecheck, token-lint).

---

## Task 1: Governance docs
- `GOVERNANCE.md` — ownership, component lifecycle (Proposed→Alpha→Beta→Stable→Deprecated), RFC/contribution flow, deprecation policy + codemods, release/semver.
- `CONTRIBUTING.md` — how to add/change a token or component, the doc-template requirement, local commands, the gates a PR must pass.
- `CHANGELOG.md` — Keep-a-Changelog format, seeded with the work so far.
- **Acceptance:** files exist, internally consistent with the spec.

## Task 2: CI quality gates
- `.github/workflows/ds-quality.yml` — on push/PR: install, build tokens, run tokens contract test, typecheck design-system, token-lint the component CSS.
- **Acceptance:** workflow YAML valid; commands match what passes locally.

## Task 3: Storybook scaffold (`apps/docs`)
- `package.json` (storybook 8, react-vite, addon-a11y, addon-essentials, vite, react).
- `.storybook/main.ts`, `.storybook/preview.tsx` (import tokens+components CSS; theme/density globals + decorator).
- **Acceptance:** `npm run build -w @mosje/docs` (storybook build) produces `storybook-static/`.

## Task 4: Stories (13-section doc template)
- Foundations: `Colors`, `Typography` MDX/TSX docs.
- Components: stories for the form layer (Input, Textarea, Select, FormField) + Button as the exemplar, each covering variants/states/a11y.
- **Acceptance:** stories typecheck and appear in the build.

## Task 5: Verify + wire + commit
- Storybook static build succeeds; add `apps/docs` note to README/architecture.
- **Acceptance:** build green; commit + push.
