# 04 Shape — Phase 0 findings (2026-08-12)

Partial run of `04-shape.md` Phase 0. **Recorded, not acted on.**

## F-1 (urgent, for the `chore/retire-legacy-tokens` owner) — radius has no `--sa-*` name

The build emits radius **only** into the legacy namespace:

```
--ds-radius-none · xxs · xs · sm · md · lg · xl · 2xl · 3xl · 4xl · 5xl · full
```

`grep` for `--sa-radius-` across `packages/design-system` and `apps/hub/src` returns **nothing**.
The DTCG source has `radius.*` primitives and `control.radius`, but the CSS format does not project
them under `--sa-`.

**Why this matters now:** `chore/retire-legacy-tokens` is deleting the `--ds-*` vocabulary. Unless
that branch also adds `--sa-radius-*`, every rounded corner in the estate loses its token. The
branch's committed tip does reference `sa-radius` in `ux4g-parity-css.mjs` and `semantic.json`, so
this may already be handled in its **uncommitted** work — which cannot be read from another
worktree.

**Action: confirm with whoever owns that branch before it lands.** This is a heads-up, not an
accusation; the visible evidence is incomplete.

## F-2 — same story for border width

No `--sa-border-width-*` consumers found either. Verify whether the family is projected at all.

## F-3 — the semantic-tier gap is confirmed by the census

Twelve radius primitives, one semantic token (`control.radius`), and **no component reads a radius
token by its `--sa-` name** because none exists. Components use `--ds-radius-*` directly, which is a
tier violation *and* a legacy-namespace dependency at the same time.

The semantic shape layer proposed in `04-shape.md` is therefore not a nice-to-have — it is the
natural place to land the `--sa-` names the retirement needs anyway.

## Consequence for sequencing

**Shape is also blocked on the retirement**, for a harder reason than typography: typography's
migration is already written, shape's namespace may not exist yet.

Suggested order once the retirement lands: **04 (shape) → 05 (depth) → 02 (typography) → 03 (space)**,
because shape's Phase 0 is now the most informative about what the retirement actually produced.
