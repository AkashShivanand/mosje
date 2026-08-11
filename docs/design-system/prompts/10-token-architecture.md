# 10 — Document SAMAVESH Token Architecture & Governance

> **Read `00-MASTER-documentation-law.md` in full before anything else.**
>
> **Run this near the end.** It documents the grammar every other foundation exercises, so it is far
> more accurate once the others have been through Phase 0 and surfaced their drift. Fold their
> findings in.

---

## WHAT THIS FOUNDATION OWNS

The system *about* the system: the tiers, the naming grammar, the pipeline, the provenance rules,
and how a token is born, changed or retired.

| Thing | Count |
|---|---:|
| `primitive.json` (Tier 1) | 385 tokens · 12 families |
| `semantic.json` (Tier 2) | 355 tokens · 23 groups |
| `system.generated.json` | 75 tokens · `bg` 46 · `text` 14 · `icon` 9 · `border` 6 |
| `component.generated.json` (Tier 3) | 288 tokens · all `action.*` |
| **Total** | **1,103** |
| Figma variables across 8 collections | **909** |
| `Static` collection | 46 |
| Guardrail tests | 20 files in `packages/tokens/test/` |

Docs page today: `resources/tokens/page.tsx`, **118 lines**. Related: `resources/governance/` (263),
`resources/contributing/` (276), `resources/changelog/` (661), `resources/design-context/` (61).

---

## THE CENTRAL IDEA — LEAD WITH IT

**A token's tier is in its name, and its name is reversible.** You can read a token and know where
it came from; you can read a Figma variable name and reconstruct the CSS custom property, and back
again. That round-trip is enforced by `figma-roundtrip.test.mjs` and `naming-grammar.test.mjs` —
which means the naming convention is not a style guide, it is a **build gate**.

Almost no design system in the industry can say that. It is this system's second-strongest idea after
measured-not-asserted contrast, and it is currently documented as a table of names rather than as an
idea. Fix that.

---

## PHASE 0 — the questions

Run the master's standard reconciliation, then:

1. **Map every one of the 20 tests to the rule it enforces**, in one table: test → rule → what
   breaks if it is removed → whether it carries a ledger of known exceptions. This table is the
   backbone of the page. A rule with a test is a contract; a rule without one is a wish, and the
   page must distinguish them.
2. **Which rules have no test?** Those are the ones that will rot. Name them.
3. **The ledgers.** `KNOWN_BELOW_AA` (may only shrink), `prominence-contract`'s shortfall ledger,
   `ghost-bindings-baseline.json`, the hue-separation ledger, `$orphans` (24 colour variables),
   `$valueChecksums.knownDifference`. Each is a **deliberate, recorded exception**. Document what
   each contains today, why, and the rule for changing it — *ledgers may shrink, never grow*.
4. **The `Static` collection (46).** What is in it, why it is static, and what makes a token
   ineligible for a mode.
5. **`component.generated.json` is 288 `action.*` tokens and nothing else.** Tier 3 exists for one
   component family. Is that because actions are uniquely complex, or because Tier 3 was started and
   not finished? Establish and state it — a tier with one occupant is either a deliberate scope or
   an abandoned plan, and readers deserve to know which.
6. **The generated-file inventory.** Every file that must never be hand-edited, its generator, and
   what happens if someone edits it anyway. Confirm each generator is actually runnable — the
   system-token generator was silently **unrunnable** for a period while its output claimed
   "GENERATED — do not edit". That must not recur, and the page should say how it is now prevented.
7. **The pipeline, end to end.** DTCG source → Style Dictionary → `tokens.css` / `tokens.ts` /
   Tailwind preset / `figma.tokens.json` / `figma.variables.json` → Figma. Draw it. Name every
   script. State what is one-way and what round-trips.
8. **`/sync-figma`** — what it does, which direction, what it cannot do, and when to reach for it.
9. **The `--ds-*` retirement** — see the master's ⚠ IN-FLIGHT note. By the time this prompt runs it
   may have landed. Check `git log origin/main`, then document the **outcome** (a completed
   migration with its rationale) rather than the mapping.
10. **Provenance taxonomy.** Every token is one of: DBIM-mandated · UX4G-aligned · SAMAVESH decision ·
    derived/generated · inherited (Bootstrap, Material). Establish whether provenance is *recorded*
    anywhere machine-readable, or only in prose. If only prose, **propose a `$extensions` provenance
    field** — it would make the provenance section generatable rather than hand-written, and
    hand-written provenance is the first thing to rot.

---

## COVERAGE CONTRACT

1. **Why tokens** — in plain terms, for a stakeholder. The argument, not the mechanism.
2. **The three tiers** — `ref` / system / `cmp`: what each is, which one you may type, and why the
   one you type 90% of the time is the shortest.
3. **The naming grammar** — `<slot>/<family>/<prominence>[/<state>]`. How to *read* a name and how to
   *construct* the one you need without looking it up. This is the section that makes the whole
   system self-service.
4. **Reversibility** — the round-trip idea, and the tests that make it a contract.
5. **The prominence ladder** — `subtler · subtle · base · bold · bolder · boldest`, UX4G's
   vocabulary, and the standing warning that **a rung name is a prominence claim, not a guarantee**.
6. **The pipeline** — the full diagram, every script named.
7. **Figma projection** — the eight collections, the mode lists, what is written into descriptions,
   and the standing rule that `Palette` stays `["Blue","Navy"]` and `dbim` never reaches Figma.
8. **The 20 guardrails** — the test map table from Phase 0.1.
9. **The ledgers** — each one, its contents, and the shrink-only rule.
10. **Generated files** — the inventory, and the prohibition.
11. **Modes and axes** — `data-brand`, `data-density`, and the removal of `data-theme` on 2026-08-10.
    What each axis touches and what it explicitly does not.
12. **Provenance** — the taxonomy, applied.
13. **Lifecycle** — how to propose a token, what gates it must pass, how it reaches Figma, how it is
    renamed (never deleted), and the `deprecated/*` path.
14. **Governance** — who decides, what evidence a change needs, and how it is recorded. Reconcile
    with `resources/governance/` and `resources/contributing/` rather than duplicating them.
15. **Versioning and the changelog** — how releases are numbered, and the parallel-branch collision
    hazard CLAUDE.md documents.
16. **UX4G 3.0 parity** — the 755-token contract, the two mapping rules (structure = exact values,
    colour = by role), the measured figure, and *specification not distribution*.
17. **Consuming the system** — what an app installs, what it imports, what it must not reach into.
18. **Do / Don't** — six pairs, aimed at contributors rather than consumers.

---

## PHASE 1 — Figma

This foundation has no dedicated Figma page and probably should not get one — its subject is the
pipeline, not a visual scale. **Ask before creating a page.** The default is:

- Verify the `Static` collection's 46 variables and their descriptions.
- Add an **"About these variables"** frame to the library's cover (`214:68343`) explaining the
  collections, the modes, the naming grammar, and where the tokens come from — so a designer who
  opens the library learns the grammar without leaving Figma.
- Confirm every collection's variables carry `codeSyntax`, and report any that do not (the 24
  `$orphans` are the known set).

---

## PHASE 2 — Website (`apps/hub/src/app/design-system/resources/tokens/`)

118 lines for the system's own architecture is far too thin. This should become one of the
strongest pages in the docs.

### What only the web can do

- **A live token explorer** — search all 1,103 tokens, filter by tier, family and provenance; show
  each one's resolved value in the current brand and density, its Figma variable name, and its
  consumers. This is the page's centrepiece.
- **A name decoder** — paste any token name and get it parsed into its grammar parts, with its tier,
  its value and its Figma equivalent.
- **A round-trip demonstrator** — CSS variable ⇄ Figma variable name, live, proving reversibility.
- **The pipeline diagram**, with each stage linking to the script that performs it.
- **The guardrail table** with each test's current status.
- **Copy-to-clipboard** everywhere.

---

## PHASE 3 — pressure test

The master's six passes, plus:

- Can a contributor, cold, work out where to add a new token and which tests it must pass?
- Does the page distinguish rules that have tests from rules that do not?
- Is every number on the page (1,103 tokens, 909 variables, 20 tests) **generated or verified**, not
  transcribed? Transcribed counts are the fastest-rotting content in any documentation.
- Does the page contradict `resources/governance/` or `resources/contributing/`?

**Score 1–5** on the master's eight dimensions. **Resistance to drift must score 5** — this is the
page about drift.

---

## DEFINITION OF DONE

- [ ] Phase 0's ten questions answered with evidence
- [ ] The 20-test → rule table produced; rules without tests named
- [ ] Every ledger documented with its contents and the shrink-only rule
- [ ] The generated-file inventory produced, and every generator confirmed runnable
- [ ] The provenance taxonomy applied; the `$extensions` provenance proposal written up
- [ ] Figma: `Static`'s 46 variables verified; the cover "About these variables" frame added;
      `codeSyntax` gaps reported
- [ ] `figma-live.json` refreshed and `$note` appended
- [ ] Website: token explorer and name decoder built; every count generated rather than transcribed
- [ ] All 18 coverage-contract items addressed, and stated where
- [ ] Reconciled with `resources/governance/` and `resources/contributing/` — no contradictions
- [ ] `design.md` §5/§6, `AGENTS.md`, `llms.txt`, changelog, nav updated
- [ ] `npm run lint` + `npm run typecheck` pass in `apps/hub`
- [ ] Six pressure-test passes run; findings, fixes and the eight scores written up
