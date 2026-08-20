---
paths:
  - "packages/design-system/**"
  - "tools/figma-doc-parity/**"
  - "docs/design-system/**"
  - "**/*.figma.ts"
---

# Figma and code stay in sync — and the sync is GATED (MANDATORY)

**A change to a component is not finished when the code is right. It is finished when
the code, the Figma master, and the Figma documentation page all say the same thing —
and a gate proves it.**

This rule exists because the estate already had two of those three in sync and shipped
a documentation page that contradicted both, for weeks, invisibly.

## The four surfaces, and the order they drift in

| Surface | What it holds | Drifts because |
|---|---|---|
| **Code** | the truth | it is what people change |
| **Figma master** | variants, properties, the component **description** | usually updated with the code, because Code Connect makes it visible |
| **Figma documentation page** | `<Topic> — Documentation` — the prose that explains the component | **nothing pointed at it**, so it was updated last or not at all |
| **Web DS docs** | `apps/hub/src/app/design-system/**` | gated by `check:ds-linkage`, `check:docs-data`, `check:docs-links` |

The documentation page is the one that rots, and it is the one people quote.

## What happened on 2026-08-19

The AccessibilityBar's label moved from `label-2` (12/16) to `body-2` (14/20). The
designer made that change **in Figma** and asked for the code to be synced to it. The
code was updated. The master's description was updated. The documentation page was not
— and neither was anything else that mentioned the old value.

An audit of that one page against the code found **ten wrong claims**:

- `Label/label-2 (12/16)` in **two** places, after the type had moved to `body-2` (14/20)
- `Underlined link` — there is no resting underline; it is hover/focus only, and on the
  words only, because `text-decoration` propagates onto the launch glyph otherwise
- `inline/s · inline/m · inline/l · padding/m · padding/2xl` — **five names that ceased
  to exist** in the spacing value-naming migration
- `shape/xxs · shape/xs` — two more, from the radius migration
- `Divider · Vertical / Inverse` — the bar had standardised on `Inverse subtle`
- `WCAG 2.1 AA` — the estate targets **2.2** (`standards-precedence.md`)
- `focus uses focus/ring` — while §04 of the **same page** correctly explained that
  `focus/ring` is `#0373DF`, measures **1.37:1** on this bar's `#005EB9` fill, and must
  never be used. The page contradicted itself four sections apart.
- Target size / 2.5.8 and the 24×24 / 28×28 hit areas appeared **nowhere**, though the
  master's description documented them

None of it is visible to a reader. That is the whole problem: **a documentation page is
believed precisely because it looks authoritative.** A wrong one is worse than none.

## The rule

1. **When you change a component, change all three surfaces in the same piece of work** —
   code, master (including its description), and the `— Documentation` page. "I'll do
   Figma after" is how this happened.
2. **Every factual claim a documentation page makes about the code gets PINNED** in
   `tools/figma-doc-parity/claims.json`: the Figma node, a snapshot of its text, and the
   assertions that re-derive the same fact from the code. `npm run check:figma-docs`
   runs in `npm run check` and in **Design System Quality**.
3. **A number on a documentation page must be derived, not typed.** If the page says
   14px, pin the token that resolves to 14. When the token moves, the gate fails and
   names the page.
4. **A behavioural claim gets pinned to the line that implements it** — a `source`
   assertion. "Focus renders inverse ink, never focus/ring" is pinned to the *absence*
   of `--sa-focus-ring` in the bar's stylesheet, so the claim cannot outlive the code.
5. **Do not weaken a claim to make the gate pass.** The gate failing means the page is
   lying. Fix the page.
6. **The reverse direction needs the token.** `check:figma-docs:live` re-fetches the live
   Figma text and fails if the snapshot has drifted; `check:figma-docs:sync` adopts the
   live text. Both need `FIGMA_ACCESS_TOKEN`, so they cannot run on every PR — run
   `:live` after editing a documentation page in Figma.

## House style, and the frame name

Documentation frames are `<Topic> — Documentation`, with an **em dash**. Divider and
Navbar both use it; the AccessibilityBar page used a slash until 2026-08-19 and was
renamed. The full grammar is `.claude/rules/figma-documentation-style.md`.

## Known gap — no page has a Component record frame

`figma-documentation-style.md` requires a sibling `<Topic> — Component record` frame for
maintainer detail (open gaps, Figma↔code parity, change history, sources). **No page in
the library has one** — not AccessibilityBar, not Divider, not Navbar. That is an
estate-wide gap, recorded here rather than fixed for one component in isolation, because
one lone record frame is inconsistency rather than progress.

## Checklist when changing a component

- [ ] Code updated
- [ ] Figma master updated — variants, properties, **and its description**
- [ ] `<Topic> — Documentation` page updated, every section, not just the obvious one
- [ ] Every numeric or behavioural claim on that page pinned in `claims.json`
- [ ] `npm run check:figma-docs` passes
- [ ] `npm run check:figma-docs:live` run if the Figma page was edited by hand
- [ ] Web DS page and `docs/design-system/components/<name>.md` updated in lockstep
- [ ] Token names in prose checked against the **current** ladder — the spacing and
      radius scales are value-named, and `inline/s` / `shape/xs` are dead
