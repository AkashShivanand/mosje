# SAMAVESH Design System — Governance

How the SAMAVESH design system is owned, changed, versioned, and retired. The 13 website
domains and 20 portals are **consumers of a versioned contract** — this document is that contract's
rulebook.

## Ownership

- **Core team** curates tokens, component APIs, and the Figma library; reviews all changes.
- **Contributors** (any app team) propose tokens, components, and patterns via the flow below.
- The `design-system-guardian` and `code-reviewer` agents review DS changes before merge.

## Component lifecycle

Every component carries a lifecycle status (shown in its Storybook docs):

| Status | Meaning | May I use it in production? |
|--------|---------|----------------------------|
| **Proposed** | RFC accepted, not built | No |
| **Alpha** | Built, API may change | Experiments only |
| **Beta** | API stabilizing, a11y reviewed | Yes, with caution |
| **Stable** | API frozen under semver; full a11y + docs | Yes |
| **Deprecated** | Superseded; scheduled for removal | Migrate away |

Promotion to **Stable** requires: full variant/state coverage, a published accessibility
statement (WCAG 2.2 AA + GIGW), the 13-section doc page, and Code Connect mapping to Figma.

## Contribution flow (RFC)

1. **Propose** — open an issue describing the need + evidence (where it's used, why existing
   components don't fit). Component proposals require an accessibility consideration.
2. **Design** — core team + proposer agree on API, tokens, and Figma representation.
3. **Build** — implement on the token contract (no hardcoded values — CI enforces this), with
   the doc page + stories. Lands as **Alpha**.
4. **Harden** — a11y review, real-usage feedback → **Beta** → **Stable**.

## Versioning (semver, per package)

- **patch** — fixes, no API change.
- **minor** — additive (new component/variant/token), backward-compatible.
- **major** — breaking: removed/renamed token or component prop, changed default.
- The backward-compatible `--ds-*` token contract is verified on every build
  (`npm test -w @mosje/tokens`); breaking it is a **major**.

## Deprecation policy

1. Mark **Deprecated** in code + docs with the replacement and the removal version.
2. Keep for **at least one minor cycle**.
3. Ship a **codemod** for renames where feasible.
4. Remove only in a **major** release, noted in `CHANGELOG.md`.

## Quality gates (enforced in CI — see `.github/workflows/ds-quality.yml`)

- **Tokens contract** — `npm test -w @mosje/tokens` (every legacy `--ds-*` resolves identically).
- **Typecheck** — `npm run typecheck -w @mosje/design-system` (strict).
- **Token-lint** — no raw hex, no Tier-1 primitive use in component CSS.
- (Planned) visual-regression + `axe` a11y per component once Storybook is wired to CI.

## Figma sync

Canonical library: **SAMAVESH Design System** (`3FF5l0SMNIwdpZrKkeyPTm`). Tokens round-trip via
Tokens Studio ⇄ DTCG; components map via Code Connect. Modify in place, additive-first,
deprecate-not-delete. Publish in reviewed batches.
