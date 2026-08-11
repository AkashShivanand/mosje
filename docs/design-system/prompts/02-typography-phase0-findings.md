# 02 Typography — Phase 0 findings (2026-08-12)

Produced by running `02-typography.md` Phase 0. **Recorded, not acted on** — per the master's rule
that Phase 0 reports and waits for a decision before any token changes.

## Build gate: GREEN

```
npm run build -w @mosje/tokens   → ✓ built (brand: mosje), 23 colours, 5 radii, 9 type roles
npm test  -w @mosje/tokens       → tests 128 · pass 128 · fail 0
```

Run sequentially. Safe to document on top of.

---

## F-1 (blocking sequencing) — typography has THREE naming vocabularies, and one is being deleted right now

| # | Vocabulary | Source | Consumers found |
|---|---|---|---|
| 1 | `font.size.*` → `--sa-font-size-*` | 7 tokens aliasing `size.*` | **zero** |
| 2 | `font.role.*` → `--sa-type-<role>-{size,lh,para}` | 63 tokens; **emitted as fluid `clamp()`** | 1 (a prose mention in the changelog) |
| 3 | `--ds-text-*` | Legacy pre-Portal-DS scale | The docs site's own `h1`–`h4` base rules |

Vocabulary 3's names **do not mean what they say**: `--ds-text-title-1` resolved to the
**headline-2** role (32px) and `--ds-text-headline` to **headline-1** (40px). This was already known
and commented in `apps/hub/src/app/design-system/design-system.css`.

**`chore/retire-legacy-tokens` has already fixed this** — verified by reading that branch directly
rather than switching to it:

```css
/* on chore/retire-legacy-tokens */
h1 { font-size: var(--sa-type-display-1-size); … }
h2 { font-size: var(--sa-type-headline-2-size); … }
h3 { font-size: var(--sa-type-title-1-size);   … }
h4 { font-size: var(--sa-type-body-1-size);    … }
```

The migration is correct and it removes the lying names. **Consequence: typography documentation
written before that branch lands would document a vocabulary that no longer exists.**

**Recommendation: run `02-typography.md` after the retirement lands on `main`.** Reorder the suite to
start with a foundation the retirement does not touch.

## F-2 — the role scale is FLUID, and that is undocumented

`font.role.*` holds fixed px in DTCG source, but the build emits
`clamp(2.5rem, calc(1.5217rem + 4.348vw), 5rem)`. So the answer to the prompt's "fluid or stepped?"
question is **fluid, 360px→1280px, per surface**. Neither `design.md` §E nor the docs page says so.

## F-3 — `--sa-font-size-*` has no consumers at all

Seven tokens, zero uses, and they duplicate rungs the role scale already covers. Candidate for
retirement — **propose, do not delete**. Confirms Phase 0.1's hypothesis that `font.size.*` is a
subset that drifted rather than a deliberate "these are the only sizes you may type" list.

## F-4 — components set no type at all

`packages/design-system/components.css` contains **zero** `font-size` declarations and zero type
tokens. Every component inherits from the host document. That is a defensible architecture, but it
means the type scale is applied entirely by app-level base styles — and therefore that a portal
which forgets those base styles gets browser defaults. Worth stating explicitly on the page.

## F-5 — a test encodes the legacy vocabulary

`ux4g-parity.test.mjs` asserts *"the `[data-surface=portal]` block re-asserts the `--ds-text-*`
aliases"*. It will need updating with the retirement. Flagged for that branch's owner, not changed
here.

---

## Still open (not yet run)

- Figma parity for the `Type` collection's 109 variables — needs a Figma MCP session.
- Whether `typography-data.ts` is generated or hand-maintained.
- Phase 0.2 duplicate roles, 0.3 tracking-all-zero, 0.4 Devanagari 1.7 derivation, 0.5 Noto Sans
  Display load status — all still to answer.
