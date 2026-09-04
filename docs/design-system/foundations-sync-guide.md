# Foundations — how the tokens, Figma and the docs stay in sync

> The implementation guide for the 2026-09-04 foundations rebuild
> (`docs/audit/2026-09-04-foundations-audit-and-rebuild.md`). Every step is a command
> or a gate; nothing here is a manual habit.

## 1. The flow, end to end

```
packages/tokens/src/*.json  ──  DTCG source (the only thing a human edits)
        │  npm run build -w @mosje/tokens
        ├─ dist/tokens.css → packages/design-system/tokens.css        (CSS contract, --sa-*)
        ├─ dist/tokens.ts, packages/design-system/tokens.ts            (TS mirror)
        ├─ dist/figma.variables.json                                    (the Figma payload)
        ├─ apps/hub/src/app/design-system/foundations/color/color-data.ts
        ├─ apps/hub/src/app/design-system/foundations/typography/typography-data.ts
        └─ apps/hub/src/lib/design-system/foundations-data.generated.ts (every other foundation)
        │  npm test -w @mosje/tokens        166 tests: grammar, contrast, visual contract, Figma parity
        │  npm run check                    the estate gates, incl. check:docs-data and check:foundations
        ▼
Figma library 3FF5l0SMNIwdpZrKkeyPTm   ──  pushed from the payload by use_figma (upsert by name)
        │  read back → packages/tokens/reference/figma-live.json ($valueChecksums, name arrays)
        ▼
/design-system/foundations/*            ──  19 pages on FoundationDocPage, tables from the generated file
```

## 2. Changing a foundation token

1. Edit `packages/tokens/src/primitive.json` (Tier 1) or `semantic.json` (Tier 2).
   Every leaf or its group carries `$type`; every group and every rung whose meaning
   differs from its neighbours carries `$description` (no braces in prose — Style
   Dictionary interpolates them).
2. `npm run build -w @mosje/tokens`. This regenerates CSS, TS, the Figma payload and all
   three docs-data files.
3. `npm test -w @mosje/tokens`.
   - **A rename** must be declared in `test/visual-contract.test.mjs` `RENAMES`; the test
     proves old-value = new-value in every selector context. Then
     `node test/lib/write-visual-contract.mjs --visual`, delete the proven entries, keep
     the dated comment.
   - **A removal** goes in `REMOVED` with evidence of zero consumers.
   - **A value change** fails `figma-value-parity` until step 4 is done. Do not edit the
     record to make it pass.
4. Push to Figma (§3), read back, re-record.
5. `npm run check` — `check:docs-data` fails if a generated docs file is stale,
   `check:foundations` if a page types a value it should read.
6. Bump `design.md` (`Last reviewed`, version line) and add the changelog entry.

## 3. Pushing to Figma

Prerequisite: `.claude/rules/figma-variables-standard.md`. The push is an **upsert by
name** into the collection `collectionFor()` routes the token to; a rename is a rename
(`variable.name = …`), never delete-and-create.

Per variable, the push sets all five fields from the payload row:

| Field | From |
|---|---|
| `name` | `variable.name` (= DTCG path, tier-prefixed for `ref`/`cmp`) |
| `description` | `variable.description` |
| `scopes` | `variable.scopes` — narrowest true set; `COLOR_OPACITY` is UI-only and must be ticked by hand |
| `codeSyntax.WEB` | `variable.codeSyntax.WEB` |
| `hiddenFromPublishing` | `variable.hiddenFromPublishing` (`true` for `ref/*`) |
| value per mode | `valuesByMode[mode]` — `ALIAS` → `createVariableAlias(target)`; `FLOAT` with `unit: "rem"` × 16; `STRING` as is; `TIMING` a number in ms; `EASING` → `{ type: "CUSTOM_CUBIC_BEZIER", easingFunctionCubicBezier: { x1, y1, x2, y2 } }`. TIMING and EASING take no scopes — do not assign any |

Order: literals first, aliases second, so a target always exists. Work one collection per
`use_figma` call; the script is atomic, so an error leaves the file untouched.

Read back with the same normaliser as `build/figma-value-parity.mjs` (`name|mode|value`,
djb2) and write `$valueChecksums.payload` (from the build) and `figmaObserved` (from
the read) into `reference/figma-live.json`, with a dated `$lastChange` sentence saying
what moved. Refresh the collection's name array. Where the two halves legitimately
differ (library-only variables authored ahead of code, a normaliser difference), say so
in `knownDifference.<Collection>` — the test reads it.

Delete a variable only after a full-file binding scan (`figma-ghost-audit.mjs`, one page
per call). Until then, rename it under `_deprecated/` with a retirement description and
`hiddenFromPublishing: true` — this is what was done with `ref/z/*`.

## 4. Adding or changing a foundation page

1. Render `<FoundationDocPage />` (`docs-kit/foundation-doc-page.tsx`) with `name`,
   `status`, `since`, `summary`, `figma` (a `FIGMA_NODES` key or an honest `absent`
   sentence), `glance` (3–6 counted stats), `sections` (claim-titled, one-word uppercase
   keyword), `tokens` (`FOUNDATIONS.<family>.tokens`), `a11y` (default untested),
   `standards` (cite the clause), `related`.
2. Every visual rule in a page-scoped `.css` beside the page, `@layer components`, tokens
   only. A refused-literal specimen marks its line `ds-exempt(specimen)`.
3. Add the nav entry in `apps/hub/src/lib/design-system/nav.ts` in dependency order,
   with a badge. `llms.txt` and the search index derive from it:
   `node scripts/build-docs-search-index.mjs`.
4. `npm run check:foundations` — 19/19 or it fails; there is no baseline.
5. A new token family needs a predicate in
   `packages/tokens/build/generate-foundation-docs-data.mjs` `FAMILIES` and a
   `guidanceFor` sentence in `build/usage-guidance.mjs` — a token with no guidance
   ships to Figma with an empty description, which the standard forbids.

## 5. Adding a foundation token family from scratch (the order that worked)

1. Source: group with `$type` + `$description`, rungs value-named where the value is a
   number, intents named by meaning where it is not. Tier 2 aliases Tier 1; nothing in
   app code binds Tier 1.
2. Grammar: add the group to `GROUP` in `build/grammar.mjs` if new; run
   `naming-grammar.test.mjs`.
3. Exporter: route in `collectionFor()`; if it cannot be a Figma variable, return `null`
   and add the reason in `exclusionReason()` — an unexplained omission fails the
   roundtrip test.
4. Guidance: `usage-guidance.mjs`.
5. TS mirror: `generate-ts-mirror.mjs` if a JS consumer needs the value.
6. Docs data: `FAMILIES` predicate.
7. Adoption: bind it in the DS (`scratchpad/adopt-css.mjs` was the 2026-09-04 pass;
   the pattern is a masked regex rewrite with a dry run first). A token nothing binds
   is worse than no token.
8. Page, nav, gate, `design.md`, changelog.

## 6. The gates, and what each one holds

| Gate | Holds |
|---|---|
| `npm test -w @mosje/tokens` | grammar, tier discipline, contrast contract, visual contract (renders never move without a declared rename), Figma roundtrip (nothing vanishes silently), value parity (the library is what the record says) |
| `check:docs-data` | colour, typography and foundations docs data are what the build produces |
| `check:foundations` | every foundation page is on the template and types no literal |
| `check:ds-linkage` | no raw fill, stroke, padding, gap or radius on a documentation page |
| `check:dangling-vars` | no `var(--sa-…)` that tokens.css does not declare |
| `lint:css` | no hex, no `--sa-ref-*` in app code |
| `check:design-context` / `check:changelog` | `design.md` and the changelog moved with the tokens |
